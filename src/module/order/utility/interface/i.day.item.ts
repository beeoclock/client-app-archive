import {DateTime} from 'luxon';

export interface IDayItem<DateType = DateTime, SLOTS_START_AND_END = DateTime> {
  isPast: boolean;
  isToday: boolean;
  isTomorrow: boolean;
    isDisabled: boolean;
  datetime: DateType;
  slots: {
    bySpecialist: Record<
      string,
      { start: SLOTS_START_AND_END; end: SLOTS_START_AND_END }[]
    >;
    byStartISO: Record<
      string,
      {
        start: SLOTS_START_AND_END;
        end: SLOTS_START_AND_END;
        specialistIds: string[];
      }
    >;
  };
}
