import {ICalendarEvent} from '@utility/library/add-to-calendar/interface/i.calendar-event';
import {BaseCalendarGenerator} from '@utility/library/add-to-calendar/generator/calendar/base.calendar.generator';

export const GOOGLE_URL =
  'https://www.google.com/calendar/render?action=TEMPLATE';

export class GoogleCalendarGenerator extends BaseCalendarGenerator {
  constructor(protected override event: ICalendarEvent) {
    super(event);
  }

  public get href(): string {
    const chunk = encodeURI(
      `${GOOGLE_URL}&dates=${this.startTime || ''}/${this.endTime || ''}&location=${this.event.address || ''}&sprop=${this.event.url || ''}`,
    );

    return (
      chunk +
      `&text=${encodeURIComponent(this.event.title || '')}` +
      `&details=${encodeURIComponent(this.formatDescriptionForOnlineCalendar(this.event.description || '') || '')}`
    );
  }
}
