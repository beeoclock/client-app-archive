import {BaseCalendarGenerator} from '@utility/library/add-to-calendar/generator/calendar/base.calendar.generator';
import {ICalendarEvent} from '@utility/library/add-to-calendar/interface/i.calendar-event';

export const OUTLOOK_BASE_URL =
  'https://outlook.live.com/owa/?rru=addevent&path=%2fcalendar%2fview%2fMonth&authRedirect=true&realm=live.com&whr=live.com&CBCXT=out&fl=wld';

export class OutlookCalendarGenerator extends BaseCalendarGenerator {
  constructor(protected override event: ICalendarEvent) {
    super(event);
  }

  public get href(): string {
    const chunk = encodeURI(
      `${OUTLOOK_BASE_URL}&startdt=${this.startTime || ''}&enddt=${this.endTime || ''}&uid=${this.uid}&location=${this.event.address}`,
    );

    return (
      chunk +
      `&subject=${encodeURIComponent(this.event.title || '')}` +
      `&body=${encodeURIComponent(this.formatDescriptionForOnlineCalendar(this.event.description || '') || '')}`
    );
  }
}
