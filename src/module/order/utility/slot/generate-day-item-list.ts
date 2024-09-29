import {DateTime} from 'luxon';

/**
 * Helper function to generate a list of day items
 * @param now
 * @param fromDatetime
 * @param toDateTime
 */
export function generateDayItemList(
    fromDatetime: DateTime,
    toDateTime: DateTime,
    now: DateTime = DateTime.now(),
) {
    const dayItemList = [];

    const diff = toDateTime.diff(fromDatetime, 'days').days;

    for (let day = 0; day < diff; day++) {
        const datetime = fromDatetime.plus({day}).startOf('day');

        const isPast = datetime.startOf('day') < now.startOf('day');
        const isToday = datetime.hasSame(now, 'day');
        const isTomorrow = datetime.hasSame(now.plus({day: 1}), 'day');

        dayItemList.push({
            isPast,
            isToday,
            isTomorrow,
            datetime,
            slots: [],
            isDisabled: true,
        });
    }

    return dayItemList;
}
