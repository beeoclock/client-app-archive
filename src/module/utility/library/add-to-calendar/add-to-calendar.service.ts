import {CalendarTypeEnum} from './enum/calendar-type.enum';
import {Injectable} from '@angular/core';
import {ICalendarEvent} from '@utility/library/add-to-calendar/interface/i.calendar-event';
import {BaseCalendarGenerator} from '@utility/library/add-to-calendar/generator/calendar/base.calendar.generator';
import {GoogleCalendarGenerator} from '@utility/library/add-to-calendar/generator/calendar/google.calendar.generator';
import {IcsCalendarGenerator} from '@utility/library/add-to-calendar/generator/calendar/ics.calendar.generator';
import {YahooCalendarGenerator} from '@utility/library/add-to-calendar/generator/calendar/yahoo.calendar.generator';
import {OutlookCalendarGenerator} from '@utility/library/add-to-calendar/generator/calendar/outlook.calendar.generator';

@Injectable()
export class AddToCalendarService {
  public calendarType = CalendarTypeEnum;

  public getHrefFor(type: CalendarTypeEnum, event: ICalendarEvent): string {
    const generatorType = this.getGeneratorFor(type) as any;

    return (new generatorType(event) as BaseCalendarGenerator).href;
  }

  // tslint:disable-next-line:member-ordering
  private _factory: (typeof BaseCalendarGenerator)[] = [
    GoogleCalendarGenerator,
    YahooCalendarGenerator,
    IcsCalendarGenerator,
    OutlookCalendarGenerator,
  ];

  private getGeneratorFor(
    type: CalendarTypeEnum,
  ): typeof BaseCalendarGenerator {
    return this._factory[type];
  }
}
