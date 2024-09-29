import {DateTime} from 'luxon';

/**
 * This method is used to find a busy slot that overlaps with a given time slot.
 * It iterates over the array of busy slots and checks if the given time slot falls within any of the busy slots.
 * If the given time slot falls within a busy slot, it returns that busy slot.
 * If the given time slot does not fall within any busy slot, it returns undefined.
 *
 * @param {DateTime} loopStart - The start time of the given time slot.
 * @param {DateTime} loopEnd - The end time of the given time slot.
 * @param {{ start: DateTime; end: DateTime }[]} busySlotsInSchedules - An array of busy slots.
 * @returns {{ start: DateTime; end: DateTime } | undefined} - The busy slot that overlaps with the given time slot, or undefined if no such busy slot exists.
 */
export function findBusySlot(
  loopStart: DateTime,
  loopEnd: DateTime,
  busySlotsInSchedules: { start: DateTime; end: DateTime }[],
): { start: DateTime; end: DateTime } | undefined {
  return busySlotsInSchedules.find((busySlot) => {
    const inside = loopStart >= busySlot.start && loopEnd <= busySlot.end;
    if (inside) {
      return true;
    }
    const startIsInSchedule =
      loopStart >= busySlot.start && loopStart < busySlot.end;
    if (startIsInSchedule) {
      return true;
    }
    const endIsInSchedule = loopEnd > busySlot.start && loopEnd <= busySlot.end;
    return endIsInSchedule;
  });
}
