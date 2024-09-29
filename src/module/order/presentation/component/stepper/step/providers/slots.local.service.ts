import {inject, Injectable} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {BooleanStreamState} from '@utility/domain/boolean-stream.state';
import {RISchedule} from '@utility/domain/interface/i.schedule';
import {DateTime} from 'luxon';
import {SlotBuildingStrategyEnum} from '@client/domain/enum/slot-building-strategy.enum';
import {BusySlotsResponseDto} from '@module/slot/domain/dto/busy-slots.response.dto';
import {getSchedulesInBusinessTimeZoneByDay} from '@order/utility/slot/get-schedules-by-day';
import {convertBusySlotsToDateTime, getBusySlotsByDay,} from '@order/utility/slot/get-busy-slots-by-day';
import {findBusySlot} from '@order/utility/slot/find-by-slot';
import {IDayItem} from '@order/utility/interface/i.day.item';
import {BehaviorSubject} from 'rxjs';
import {is} from '@utility/checker';
import {generateDayItemList} from '@order/utility/slot/generate-day-item-list';

@Injectable()
export class SlotsLocalService {
    private readonly ngxLogger = inject(NGXLogger);

    public readonly initializing = new BooleanStreamState(false);
    public readonly loader = new BooleanStreamState(true);

    public readonly now = DateTime.now();
    // public readonly now = DateTime.local(2024, 4, 15, 16, 29, 0);

    private busyMapBySpecialistId: Record<string, BusySlotsResponseDto[]> | null =
        null;

    // Specialist who allows to serve the selected service
    private specialistIdsForSelectedService: string[] = [];

    private schedules: RISchedule[] = [];
    private timeZone: string | undefined;
    private serviceDurationInSeconds = 0;
    private slotBuildingStrategy: SlotBuildingStrategyEnum =
        SlotBuildingStrategyEnum.ByService;
    private slotIntervalInSeconds = 0;

    private dayItemList: IDayItem[] = [];

    public readonly dayItemList$ = new BehaviorSubject<IDayItem[]>([]);

    public setSpecialistIdsForSelectedService(
        specialistIdsForSelectedService: string[],
    ) {
        this.ngxLogger.debug(
            'SlotsLocalService:setSpecialistIdsForSelectedService',
            {
                specialistIdsForSelectedService,
            },
        );
        this.specialistIdsForSelectedService = specialistIdsForSelectedService;
        return this;
    }

    public setBusyMapBySpecialistId(
        busyMapBySpecialistId: Record<string, BusySlotsResponseDto[]> | null,
    ) {
        this.ngxLogger.debug('SlotsLocalService:setBusySlots', {
            busyMapBySpecialistId,
        });
        this.busyMapBySpecialistId = busyMapBySpecialistId;
        return this;
    }

    /**
     * Set schedules
     * @param timeZone
     */
    public setTimeZone(timeZone: string | undefined) {
        this.ngxLogger.debug('SlotsLocalService:setTimeZone', {timeZone});
        this.timeZone = timeZone;
        return this;
    }

    /**
     * Set schedules
     * @param schedules
     */
    public setSchedules(schedules: RISchedule[]) {
        this.ngxLogger.debug('SlotsLocalService:setSchedules', {schedules});
        this.schedules = schedules;
        return this;
    }

    /**
     * Set service duration in seconds
     * @param serviceDurationInSeconds
     */
    public setServiceDurationInSeconds(serviceDurationInSeconds: number) {
        this.ngxLogger.debug('SlotsLocalService:setServiceDurationInSeconds', {
            serviceDurationInSeconds: serviceDurationInSeconds,
        });
        this.serviceDurationInSeconds = serviceDurationInSeconds;
        return this;
    }

    /**
     * Set slotBuildingStrategy
     * @param slotBuildingStrategy
     */
    public setSlotBuildingStrategy(
        slotBuildingStrategy: SlotBuildingStrategyEnum,
    ) {
        this.ngxLogger.debug('SlotsLocalService:slotBuildingStrategy', {
            slotBuildingStrategy,
        });
        this.slotBuildingStrategy = slotBuildingStrategy;
        return this;
    }

    /**
     * Set slotIntervalInSeconds
     * @param slotIntervalInSeconds
     */
    public setSlotIntervalInSeconds(slotIntervalInSeconds: number) {
        this.ngxLogger.debug('SlotsLocalService:setSlotIntervalInSeconds', {
            slotIntervalInSeconds,
        });
        this.slotIntervalInSeconds = slotIntervalInSeconds;
        return this;
    }

    public getDayItemList() {
        return this.dayItemList;
    }

    /**
     * Get slots by day
     * @param day
     */
    public getSlotsByDay(day: DateTime): IDayItem['slots'] {
        const dayItem = this.dayItemList.find((dayItem) => {
            return dayItem.datetime.hasSame(day, 'day');
        });
        return (
            dayItem?.slots ?? {
                bySpecialist: {},
                byStartISO: {},
            }
        );
    }

    public necessaryValueIsExist() {
        if (!this.timeZone) {
            this.ngxLogger.error('Time zone is not defined');
            return false;
        }

        if (!this.schedules.length) {
            this.ngxLogger.error('Schedules are not defined');
            return false;
        }

        if (!this.specialistIdsForSelectedService.length) {
            this.ngxLogger.error('Specialist IDs are not defined');
            return false;
        }

        if (is.not_number(this.serviceDurationInSeconds)) {
            this.ngxLogger.error('Service duration in seconds is not defined');
            return false;
        }

        if (!this.slotBuildingStrategy) {
            this.ngxLogger.error('Slot building strategy is not defined');
            return false;
        }

        if (is.not_number(this.slotIntervalInSeconds)) {
            this.ngxLogger.error('Slot interval in seconds is not defined');
            return false;
        }

        if (!this.dayItemList.length) {
            this.ngxLogger.error('Day item list is not defined');
            return false;
        }

        if (!this.busyMapBySpecialistId) {
            this.ngxLogger.error('Busy map by specialist ID is not defined');
            return false;
        }

        return true;
    }

    public initDayItemList(startDateTime: DateTime, endDateTime: DateTime) {
        this.dayItemList = generateDayItemList(startDateTime, endDateTime).map(
            (dayItem) => {
                return {
                    ...dayItem,
                    slots: {
                        bySpecialist: {},
                        byStartISO: {},
                    },
                };
            },
        );
    }

    /**
     * Initialize slots
     */
    public async initSlots() {
        this.loader.switchOn();

        try {
            this.ngxLogger.debug(
                'SlotsLocalService:initSlots: Start initializing slots',
            );

            // #1 Calculate all free schedules pieces based on busy slots
            this.prepareEachDayItemAtList();

            this.dayItemList$.next(this.dayItemList);

            if (this.initializing.isOn) {
                this.ngxLogger.debug(
                    'Initialized: First time initialize, after service has been selected',
                );

                this.initializing.switchOff();
            }
        } catch (e) {
            this.ngxLogger.error(e);
        } finally {
            setTimeout(() => {
                this.loader.switchOff();
            }, 250);
        }

        return this;
    }

    /**
     * This method is used to prepare each day item in the list.
     * It iterates over the array of day items and performs the following operations for each day item:
     * - Clears the slots for the day item.
     * - Checks if the date of the day item is before the earliest booking date or after the latest booking date. If it is, it skips the current iteration.
     * - Finds the schedules for the current day. If no schedules are found, it skips the current iteration.
     * - Processes the schedules and busy slots for the current day after performing certain verifications.
     * After all day items have been processed, it logs the day item list.
     *
     */
    private prepareEachDayItemAtList() {
        this.ngxLogger.debug(
            'prepareEachDayItemAtList: dayItemList',
            this.dayItemList,
        );

        if (!this.dayItemList.length) {
            this.ngxLogger.error('prepareEachDayItemAtList: dayItemList is empty');
            return;
        }

        for (const dayItem of this.dayItemList) {
            // #2 Find schedules for current day
            let schedulesInBusinessTimeZone = getSchedulesInBusinessTimeZoneByDay(
                this.schedules,
                this.timeZone,
                this.serviceDurationInSeconds,
                dayItem.datetime,
            );

            if (!schedulesInBusinessTimeZone.length) {
                continue;
            }

            this.doProcessAfterVerifications(dayItem, schedulesInBusinessTimeZone);
        }

        this.ngxLogger.debug(
            'calculateFreeSchedulePiecesPerDay: dayItemList',
            this.dayItemList,
        );
    }

    /**
     * This method is used to process the schedules and busy slots for a specific day after performing certain verifications.
     * It first finds the busy slots for the current day and checks if there are any busy slots that cover the entire schedule.
     * If such busy slots are found, it removes the corresponding schedules.
     * Then, it iterates over the remaining schedules and for each schedule, it checks if the start time is in the past.
     * If the start time is in the past, it adjusts the start time to the next available interval.
     * Finally, it fills the day with slots from the start to the end of the schedule, skipping any busy slots.
     *
     * @param {IDayItem} dayItem - The day item object to which slots are added.
     * @param {{ start: DateTime; end: DateTime }[]} schedulesInBusinessTimeZone - An array of schedules for the current day.
     */
    private doProcessAfterVerifications(
        dayItem: IDayItem,
        schedulesInBusinessTimeZone: { start: DateTime; end: DateTime }[],
    ) {
        const intervalInMinutes = this.getIntervalInMinutes();

        let filteredSchedulesInBusinessTimeZone: { start: DateTime; end: DateTime }[] = [];

        for (const specialistIdForSelectedService of this
            .specialistIdsForSelectedService) {
            const indexesOfBusySlotsWhichCoverSchedule: number[] = [];
            const busySlotsForSelectedSpecialist = this.busyMapBySpecialistId![specialistIdForSelectedService] ?? [];
            // #3 Find busy slots for current day
            const busySlotsInSchedules = getBusySlotsByDay(
                dayItem.datetime,
                busySlotsForSelectedSpecialist,
                schedulesInBusinessTimeZone,
                indexesOfBusySlotsWhichCoverSchedule,
            );

            // #4 Check if there are busy slots which cover schedule
            if (indexesOfBusySlotsWhichCoverSchedule.length) {
                this.ngxLogger.debug(
                    'Found busy slots which cover schedule',
                    indexesOfBusySlotsWhichCoverSchedule,
                );
                // Remove schedules which are covered by busy slots
                filteredSchedulesInBusinessTimeZone = schedulesInBusinessTimeZone.filter(
                    (schedule, index) => {
                        return !indexesOfBusySlotsWhichCoverSchedule.includes(index);
                    },
                );
            } else {
                filteredSchedulesInBusinessTimeZone = schedulesInBusinessTimeZone;
            }

            // #5 Fill day with slots from start to end of schedule peer specialist

            for (const schedule of filteredSchedulesInBusinessTimeZone) {
                let loopStart = schedule.start;
                const finish = schedule.end;

                // 5.1 Check if loopStart is in the past
                while (loopStart < this.now) {
                    loopStart = loopStart.plus({minutes: intervalInMinutes});
                }

                this.fillDayItemWithSlots(
                    specialistIdForSelectedService,
                    loopStart,
                    finish,
                    busySlotsInSchedules,
                    dayItem,
                    intervalInMinutes,
                );
            }
        }
    }

    /**
     * This method is used to get the interval in minutes based on the slot building strategy.
     * If the strategy is 'ByService', it returns the event duration in seconds divided by 60.
     * If the strategy is 'ByInterval', it returns the slot interval in seconds divided by 60.
     * If the strategy is not defined, it returns 0.
     *
     * @returns {number} - The interval in minutes based on the slot building strategy.
     */
    private getIntervalInMinutes(): number {
        // TODO: fix some problems with zero value of serviceDurationInSeconds and slotIntervalInSeconds

        switch (this.slotBuildingStrategy) {
            case SlotBuildingStrategyEnum.ByService:
                return this.serviceDurationInSeconds / 60;
            case SlotBuildingStrategyEnum.ByInterval:
                return this.slotIntervalInSeconds / 60;
            default:
                return 0;
        }
    }

    /**
     * This method is used to fill a day with slots. It iterates from the start of the day to the end of the day,
     * checking for any busy slots. If a busy slot is found, it skips to the end of the busy slot and continues.
     * If no busy slot is found, it adds a new slot to the day and moves to the next slot.
     *
     * @param specialistIdForSelectedService
     * @param {DateTime} loopStart - The start time of the day.
     * @param {DateTime} finish - The end time of the day.
     * @param {{ start: DateTime; end: DateTime }[]} busySlotsInSchedules - An array of busy slots for the day.
     * @param {IDayItem} dayItem - The day item object to which slots are added.
     * @param intervalInMinutes
     */
    private fillDayItemWithSlots(
        specialistIdForSelectedService: string,
        loopStart: DateTime,
        finish: DateTime,
        busySlotsInSchedules: BusySlotsResponseDto[],
        dayItem: IDayItem,
        intervalInMinutes: number,
    ) {

        // Loop from the start of the day to the end of the day
        while (loopStart < finish) {
            // Calculate the end of the current slot
            const loopEnd = loopStart.plus({second: this.serviceDurationInSeconds});

            // Check if the current slot is a busy slot
            const busySlot = findBusySlot(
                loopStart,
                loopEnd,
                convertBusySlotsToDateTime(busySlotsInSchedules),
            );

            // If the current slot is a busy slot, skip to the end of the busy slot
            if (busySlot) {
                // Round loopStart to busySlot.end
                loopStart = busySlot.end;
                continue;
            } else {
                // If the end of the current slot is after the end of the day, set the start of the next slot to the end of the day
                if (loopEnd > finish) {
                    loopStart = finish;
                    continue;
                }
                // If the current slot is not a busy slot, add it to the day
                const slot = {
                    start: loopStart.setZone(DateTime.now().zoneName), // Set the zone to the local time zone
                    end: loopEnd.setZone(DateTime.now().zoneName),
                };
                if (!dayItem.slots.bySpecialist[specialistIdForSelectedService]) {
                    dayItem.slots.bySpecialist[specialistIdForSelectedService] = [];
                }
                const slotStartIso = slot.start.toJSDate().toISOString();
                dayItem.slots.bySpecialist[specialistIdForSelectedService].push(slot);
                dayItem.slots.byStartISO[slotStartIso] = {
                    ...slot,
                    specialistIds: [
                        ...(dayItem.slots.byStartISO[slotStartIso]?.specialistIds ?? []),
                        specialistIdForSelectedService,
                    ],
                };
            }

            // Move to the next slot
            loopStart = loopStart.plus({minutes: intervalInMinutes});
        }

        dayItem.isDisabled = (Object.values(dayItem.slots.bySpecialist).length + Object.values(dayItem.slots.byStartISO).length) === 0;

    }
}
