import {RISchedule} from '@utility/domain/interface';
import {DateTime} from 'luxon';

/**
 * Function to get schedules for a specific day.
 *
 * Example usage of the `getSchedulesByDay` function.
 *
 * @example
 * ```typescript
 * import { getSchedulesByDay } from './get-schedules-by-day';
 * import { DateTime } from 'luxon';
 * import { RISchedule } from "@utility/domain/interface";
 *
 * // Define the schedules
 * const schedules: RISchedule[] = [
 *   {
 *     workDays: [1, 2, 3, 4, 5], // Monday to Friday
 *     startInSeconds: 9 * 60 * 60, // 9:00 AM
 *     endInSeconds: 17 * 60 * 60, // 5:00 PM
 *   },
 *   {
 *     workDays: [6], // Saturday
 *     startInSeconds: 10 * 60 * 60, // 10:00 AM
 *     endInSeconds: 14 * 60 * 60, // 2:00 PM
 *   },
 * ];
 *
 * // Define the event duration in seconds
 * const serviceDurationInSeconds = 3_600; // 1 hour
 *
 * // Define the latest booking date and time
 * const latestBookingDateTime = DateTime.local(2023, 5, 15, 23, 0); // 20:00 in UTC
 *
 * // Define the date and time in the local time zone
 * const datetimeByLocalTimeZone = DateTime.local(2023, 5, 15, 14, 0); // 15th May 2023 00:00 (Monday)
 *
 * // Call the function
 * const result = getSchedulesByDay(schedules, 'UTC', serviceDurationInSeconds, latestBookingDateTime, datetimeByLocalTimeZone);
 *
 * ```
 *
 * @param {RISchedule[]} schedules - An array of schedules. Each schedule is an object that includes workDays, startInSeconds, and endInSeconds.
 * @param {string | undefined} businessTimeZone - The time zone of the business. If undefined, an error will be thrown.
 * @param {number} eventDurationInSeconds - The duration of the event in seconds.
 * @param {DateTime} datetimeByLocalTimeZone - The date and time in the local time zone.
 *
 * @returns {Object[]} An array of schedule objects. Each object includes a start and end DateTime in the business time zone.
 *
 * @throws {Error} If the business time zone is not set.
 */
export function getSchedulesInBusinessTimeZoneByDay(
    schedules: Pick<RISchedule, 'workDays' | 'startInSeconds' | 'endInSeconds'>[],
    businessTimeZone: string | undefined, // 'Europe/Warsaw'
    eventDurationInSeconds: number,
    datetimeByLocalTimeZone: DateTime,
): {
    start: DateTime;
    end: DateTime;
}[] {
    if (!businessTimeZone) {
        throw new Error('Business time zone is not set.');
    }

    const datetimeByBusinessTimeZone = datetimeByLocalTimeZone
        .startOf('day')
        .setZone(businessTimeZone);
    const startDatetimeByBusinessTimeZone =
        datetimeByBusinessTimeZone.startOf('day');
    const endDatetimeByBusinessTimeZone = datetimeByBusinessTimeZone.plus({
        day: 1,
    }); // plus 24 hours

    const result = [];

    for (const {workDays, startInSeconds, endInSeconds} of schedules) {
        // #2.1 Filter schedules by event duration, schedule gaps should be more than event duration
        // endInSeconds - startInSeconds  it is the same as scheduleDuration
        if ((endInSeconds - startInSeconds) < eventDurationInSeconds) {
            continue;
        }

        let schedule = null;

        // #2.0 Filter schedules by work days
        if (workDays?.includes(startDatetimeByBusinessTimeZone.weekday)) {
            // #2.3 Convert seconds to datetime
            schedule = {
                start: startDatetimeByBusinessTimeZone.plus({second: startInSeconds}),
                end: startDatetimeByBusinessTimeZone.plus({second: endInSeconds}),
            };

            if (schedule.end < datetimeByBusinessTimeZone) {
                schedule = null;
            }
        }

        if (
            !schedule &&
            workDays?.includes(endDatetimeByBusinessTimeZone.weekday)
        ) {
            // #2.3 Convert seconds to datetime
            schedule = {
                start: endDatetimeByBusinessTimeZone
                    .startOf('day')
                    .plus({second: startInSeconds}),
                end: endDatetimeByBusinessTimeZone
                    .startOf('day')
                    .plus({second: endInSeconds}),
            };

            if (schedule.start > endDatetimeByBusinessTimeZone) {
                schedule = null;
            }
        }

        if (!schedule) {
            continue;
        }

        result.push(schedule);
    }

    // #2.2 Sort schedules by start time
    return result.sort((a, b) => a.start.toMillis() - b.start.toMillis());
}
