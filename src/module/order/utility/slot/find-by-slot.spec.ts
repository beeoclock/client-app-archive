import {DateTime} from 'luxon';
import {findBusySlot} from '@order/utility/slot/find-by-slot';

describe('findBusySlot', () => {
  test('returns undefined when no busy slots overlap with the given time slot', () => {
    const loopStart = DateTime.local(2023, 5, 15, 10, 0);
    const loopEnd = DateTime.local(2023, 5, 15, 11, 0);
    const busySlotsInSchedules = [
      {
        start: DateTime.local(2023, 5, 15, 12, 0),
        end: DateTime.local(2023, 5, 15, 13, 0),
      },
      {
        start: DateTime.local(2023, 5, 15, 14, 0),
        end: DateTime.local(2023, 5, 15, 15, 0),
      },
    ];
    const result = findBusySlot(loopStart, loopEnd, busySlotsInSchedules);
    expect(result).toBeUndefined();
  });

  test('returns the busy slot when the given time slot is completely inside a busy slot', () => {
    const loopStart = DateTime.local(2023, 5, 15, 10, 30);
    const loopEnd = DateTime.local(2023, 5, 15, 11, 30);
    const busySlotsInSchedules = [
      {
        start: DateTime.local(2023, 5, 15, 10, 0),
        end: DateTime.local(2023, 5, 15, 12, 0),
      },
    ];
    const result = findBusySlot(loopStart, loopEnd, busySlotsInSchedules);
    expect(result).toEqual(busySlotsInSchedules[0]);
  });

  test('returns the busy slot when the given time slot overlaps with the start of a busy slot', () => {
    const loopStart = DateTime.local(2023, 5, 15, 9, 30);
    const loopEnd = DateTime.local(2023, 5, 15, 10, 30);
    const busySlotsInSchedules = [
      {
        start: DateTime.local(2023, 5, 15, 10, 0),
        end: DateTime.local(2023, 5, 15, 12, 0),
      },
    ];
    const result = findBusySlot(loopStart, loopEnd, busySlotsInSchedules);
    expect(result).toEqual(busySlotsInSchedules[0]);
  });

  test('returns the busy slot when the given time slot overlaps with the end of a busy slot', () => {
    const loopStart = DateTime.local(2023, 5, 15, 11, 30);
    const loopEnd = DateTime.local(2023, 5, 15, 12, 30);
    const busySlotsInSchedules = [
      {
        start: DateTime.local(2023, 5, 15, 10, 0),
        end: DateTime.local(2023, 5, 15, 12, 0),
      },
    ];
    const result = findBusySlot(loopStart, loopEnd, busySlotsInSchedules);
    expect(result).toEqual(busySlotsInSchedules[0]);
  });
});
