import {DateTime} from 'luxon';
import {BusySlotsResponseDto} from '@module/slot/domain/dto/busy-slots.response.dto';

/**
 * This method is used to filter busy slots that occur on a specific day and within the provided schedules.
 * It iterates over the array of busy slots and checks if the start or end of the busy slot falls on the same day as the provided date.
 * If the busy slot does not fall on the same day, it is ignored.
 * If the busy slot falls on the same day, it checks if the busy slot is within any of the provided schedules.
 * If the busy slot is within a schedule, it returns true and the busy slot is included in the returned array.
 * If the busy slot is not within any schedule, it returns false and the busy slot is not included in the returned array.
 * If the busy slot covers a schedule, the index of the schedule is added to the indexesOfBusySlotsWhichCoverSchedule array.
 *
 * @param {DateTime} datetime - The date to filter the busy slots by.
 * @param {{ start: DateTime; end: DateTime }[]} busySlotsInDateTime - An array of busy slots.
 * @param {{ start: DateTime; end: DateTime }[]} schedulesInBusinessTimeZone - An array of schedules.
 * @param {number[]} indexesOfBusySlotsWhichCoverSchedule - An array to store the indexes of schedules that are covered by a busy slot.
 * @returns {{ start: DateTime; end: DateTime }[]} - An array of busy slots that occur on the provided date and within the provided schedules.
 */

export function getBusySlotsByDay(
    datetime: DateTime,
    busySlotsInDateTime: BusySlotsResponseDto[],
    schedulesInBusinessTimeZone: { start: DateTime; end: DateTime }[],
    indexesOfBusySlotsWhichCoverSchedule: number[],
): BusySlotsResponseDto[] {
    return busySlotsInDateTime.filter((busySlot) => {

        let {start: startISO, end: endISO} = busySlot;

        if (!startISO || !endISO) {
            return;
        }

        const start = DateTime.fromISO(startISO);
        const end = DateTime.fromISO(endISO);
        const startHasSameDay = datetime.hasSame(start, 'day');
        const endHasSameDay = datetime.hasSame(end, 'day');
        if (!startHasSameDay && !endHasSameDay) {
            // Check if datetime is not in side of start and end range
            if (datetime < start || datetime > end) {
                return;
            }
        }
        const busySlotIsInSchedule = schedulesInBusinessTimeZone.some(
            (scheduleInBusinessTimeZone, index) => {
                const inside =
                    start >= scheduleInBusinessTimeZone.start &&
                    end <= scheduleInBusinessTimeZone.end;
                if (inside) {
                    return true;
                }
                const outside =
                    start <= scheduleInBusinessTimeZone.start &&
                    end >= scheduleInBusinessTimeZone.end;
                if (outside) {
                    indexesOfBusySlotsWhichCoverSchedule.push(index);
                    return true;
                }
                const startIsInSchedule =
                    start >= scheduleInBusinessTimeZone.start &&
                    start <= scheduleInBusinessTimeZone.end;
                if (startIsInSchedule) {
                    return true;
                }
                const endIsInSchedule =
                    end >= scheduleInBusinessTimeZone.start &&
                    end <= scheduleInBusinessTimeZone.end;
                return endIsInSchedule;
            },
        );
        return busySlotIsInSchedule;
    });
}

export function convertBusySlotsToDateTime(
    busySlots: BusySlotsResponseDto[],
): { start: DateTime; end: DateTime }[] {
    return busySlots.map((busySlot) => {
        return {
            start: DateTime.fromISO(busySlot.start),
            end: DateTime.fromISO(busySlot.end),
        };
    });
}
