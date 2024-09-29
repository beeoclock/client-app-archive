import {getSchedulesInBusinessTimeZoneByDay} from './get-schedules-by-day';
import {DateTime} from 'luxon';
import {RISchedule} from '@utility/domain/interface';
import {WeekDaysEnum, WEEKEND, WORK_WEEK} from '@utility/domain/enum';

describe('getSchedulesInBusinessTimeZoneByDay', () => {
  const currentTimeZone = 'Europe/Kiev';
  const businessTimeZone = 'Europe/Warsaw';
  const mockSchedules: Pick<
    RISchedule,
    'workDays' | 'startInSeconds' | 'endInSeconds'
  >[] = [
    {
      // In businessTimeZone
      workDays: WORK_WEEK, // Monday to Friday
      startInSeconds: 14 * 60 * 60, // Warsaw 9:00 Kiev 10:00
      endInSeconds: 17 * 60 * 60, // Warsaw 17:00 Kiev 18:00
    },
    {
      // In businessTimeZone
      workDays: WORK_WEEK, // Monday to Friday
      startInSeconds: 9 * 60 * 60, // Warsaw 9:00 Kiev 10:00
      endInSeconds: 13 * 60 * 60, // Warsaw 17:00 Kiev 18:00
    },
    {
      // In businessTimeZone
      workDays: [WeekDaysEnum.SATURDAY], // Saturday
      startInSeconds: 10 * 60 * 60, // Warsaw 10:00 Kiev 11:00
      endInSeconds: 14 * 60 * 60, // Warsaw 14:00 Kiev 15:00
    },
  ];
  const eventDurationInSeconds = 3_600; // 1 hour
  const latestBookingDateTime = DateTime.local(2023, 5, 16, 14, 0, {
    zone: businessTimeZone,
  }); // 20:00 in UTC
  const datetimeByLocalTimeZone = DateTime.local(2023, 5, 15, 17, 0, {
    zone: currentTimeZone,
  }); // 15th May 2023 00:00 (Monday)

  it('returns schedules for a specific day', () => {
    const result = getSchedulesInBusinessTimeZoneByDay(
      mockSchedules,
      businessTimeZone,
      eventDurationInSeconds,
      latestBookingDateTime,
      datetimeByLocalTimeZone,
    );

    const expected = [
      {
          start: DateTime.local(2023, 5, 15, 9, 0, {zone: businessTimeZone}),
          end: DateTime.local(2023, 5, 15, 13, 0, {zone: businessTimeZone}),
      },
      {
          start: DateTime.local(2023, 5, 15, 14, 0, {zone: businessTimeZone}),
          end: DateTime.local(2023, 5, 15, 17, 0, {zone: businessTimeZone}),
      },
    ];
    expect(result).toEqual(expected);
  });

  it('throws an error when business time zone is not set', () => {
    expect(() =>
      getSchedulesInBusinessTimeZoneByDay(
        mockSchedules,
        undefined,
        eventDurationInSeconds,
        latestBookingDateTime,
        datetimeByLocalTimeZone,
      ),
    ).toThrow('Business time zone is not set.');
  });

  it('returns empty array when no schedules match the criteria', () => {
    const result = getSchedulesInBusinessTimeZoneByDay(
      [],
      businessTimeZone,
      eventDurationInSeconds,
      latestBookingDateTime,
      datetimeByLocalTimeZone,
    );
    expect(result).toEqual([]);
  });

  it('returns schedules sorted by start time', () => {
    const result = getSchedulesInBusinessTimeZoneByDay(
      mockSchedules,
      businessTimeZone,
      eventDurationInSeconds,
      latestBookingDateTime,
      datetimeByLocalTimeZone,
    );
    const expected = [
      {
          start: DateTime.local(2023, 5, 15, 9, 0, {zone: businessTimeZone}),
          end: DateTime.local(2023, 5, 15, 13, 0, {zone: businessTimeZone}),
      },
      {
          start: DateTime.local(2023, 5, 15, 14, 0, {zone: businessTimeZone}),
          end: DateTime.local(2023, 5, 15, 17, 0, {zone: businessTimeZone}),
      },
    ];
    expect(result).toEqual(expected);
  });

  it('filters out schedules where duration is less than event duration', () => {
    const shortSchedule: Pick<
      RISchedule,
      'workDays' | 'startInSeconds' | 'endInSeconds'
    > = {
      workDays: [1, 2, 3, 4, 5], // Monday to Friday
      startInSeconds: 9 * 60 * 60, // 9:00 AM
      endInSeconds: 9 * 60 * 60 + 30 * 60, // 9:30 AM
    };
    const result = getSchedulesInBusinessTimeZoneByDay(
      [shortSchedule],
      businessTimeZone,
      eventDurationInSeconds,
      latestBookingDateTime,
      datetimeByLocalTimeZone,
    );
    expect(result).toEqual([]);
  });

  it('filters out schedules that are not on a work day', () => {
    const weekendSchedule: Pick<
      RISchedule,
      'workDays' | 'startInSeconds' | 'endInSeconds'
    > = {
      workDays: WEEKEND, // Saturday and Sunday
      startInSeconds: 10 * 60 * 60, // 10:00 AM
      endInSeconds: 14 * 60 * 60, // 2:00 PM
    };
    const result = getSchedulesInBusinessTimeZoneByDay(
      [weekendSchedule],
      businessTimeZone,
      eventDurationInSeconds,
      latestBookingDateTime,
      datetimeByLocalTimeZone,
    );
    expect(result).toEqual([]);
  });
});
