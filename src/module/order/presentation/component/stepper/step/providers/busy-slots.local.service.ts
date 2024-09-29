import {inject, Injectable} from '@angular/core';
import {GetBusySlotApiAdapter} from '@module/slot/adapter/external/api/get.busy.slot.api.adapter';
import {BooleanStreamState} from '@utility/domain/boolean-stream.state';
import {BusySlotsResponseDto} from '@module/slot/domain/dto/busy-slots.response.dto';
import {DateTime} from 'luxon';
import {NGXLogger} from 'ngx-logger';

@Injectable()
export class BusySlotsLocalService {
    private readonly getBusySlotApiAdapter = inject(GetBusySlotApiAdapter);
    private readonly ngxLogger = inject(NGXLogger);

    private busySlots: BusySlotsResponseDto[] = [];
    private busySlotsMapBySpecialistId: Record<
        string,
        BusySlotsResponseDto[]
    > | null = null;
    private temporaryBusySlotsMapBySpecialistId: Record<
        string,
        BusySlotsResponseDto[]
    > | null = null;
    public readonly loading = new BooleanStreamState(false);

    public getBusySlots(): BusySlotsResponseDto[] {
        return this.busySlots;
    }

    public getBusySlotsMapBySpecialistId(): Record<
        string,
        BusySlotsResponseDto[]
    > {
        return this.busySlotsMapBySpecialistId ?? {};
    }

    public getTemporaryBusySlotsMapBySpecialistId(): Record<
        string,
        BusySlotsResponseDto[]
    > {
        return this.temporaryBusySlotsMapBySpecialistId ?? {};
    }

    public putToTemporaryBusySlotForSpecialistId(
        specialistId: string,
        slot: { start: string; end: string },
    ) {
        if (!this.temporaryBusySlotsMapBySpecialistId) {
            this.temporaryBusySlotsMapBySpecialistId = {};
        }

        if (!this.temporaryBusySlotsMapBySpecialistId[specialistId]) {
            this.temporaryBusySlotsMapBySpecialistId[specialistId] = [];
        }

        this.temporaryBusySlotsMapBySpecialistId[specialistId].push({
            start: slot.start,
            end: slot.end,
            specialistIds: [specialistId],
        });
    }

    public deleteTemporaryBusySlotForSpecialistId() {
        this.temporaryBusySlotsMapBySpecialistId = null;
    }

    public async initBusySlots(startDateTime: DateTime, endDateTime: DateTime) {
        this.ngxLogger.info(
            'BusySlotsLocalService.initBusySlots',
            startDateTime,
            endDateTime,
        );

        this.loading.switchOn();

        this.busySlots = await this.getBusySlotApiAdapter.executeAsync({
            start: startDateTime.startOf('day').toJSDate().toISOString(),
            end: endDateTime.endOf('day').toJSDate().toISOString(),
        });

        this.busySlotsMapBySpecialistId = this.busySlots.reduce(
            (acc, item) => {
                item.specialistIds.forEach((specialistId) => {
                    if (!acc[specialistId]) {
                        acc[specialistId] = [];
                    }
                    acc[specialistId].push(item);
                });
                return acc;
            },
            {} as Record<string, BusySlotsResponseDto[]>,
        );

        this.loading.switchOff();
    }
}
