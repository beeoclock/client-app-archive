import {ICalendarEvent} from '@utility/library/add-to-calendar/interface/i.calendar-event';

export const MS_IN_MINUTES = 60 * 1000;
export const DATE_PUNCTUATION_REGEX = /-|:|\.\d+/g;

export abstract class BaseCalendarGenerator {
  protected startTime: string;
  protected endTime: string;
  protected description: string;

  public abstract get href(): string;

  constructor(protected event: ICalendarEvent) {
    this.startTime = this.formatTime(event.start);
    this.endTime = this.calculateEndTime(event);
    this.description = this.formatDescription(event.description || '');
  }

  protected get uid(): string {
    return (
      this.s4() +
      this.s4() +
      '-' +
      this.s4() +
      '-4' +
      this.s4().substr(0, 3) +
      '-' +
      this.s4() +
      '-' +
      this.s4() +
      this.s4() +
      this.s4()
    ).toLowerCase();
  }

  protected formatDescription(description: string): string {
    return description.replace(/'/g, "'");
  }

  protected formatDescriptionForOnlineCalendar(
    description: string,
  ): string | null {
    if (description.length) {
      return description.replace(/\\r/g, '\n').replace(/\\n/g, '\n');
    }

    return null;
  }

  protected formatTime(date: Date): string {
    return date.toISOString().replace(DATE_PUNCTUATION_REGEX, '');
  }

  protected calculateEndTime(event: any): string {
    if (event.end) {
      return this.formatTime(event.end);
    }

    if (!event.duration) {
      throw new Error('You have to provide either the duration or end');
    }

    return this.formatTime(
      new Date(event.start.getTime() + event.duration * MS_IN_MINUTES),
    );
  }

  private s4(): string {
    // tslint:disable-next-line
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
}
