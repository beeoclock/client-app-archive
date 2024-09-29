import {Component, inject, Input, OnInit, ViewEncapsulation,} from '@angular/core';
import {NgForOf} from '@angular/common';
import {RISchedule} from '@utility/domain/interface';
import {WEEK_DAYS_OBJECTS} from '@utility/domain/enum';
import {TranslateService} from '@ngx-translate/core';
import {Store} from '@ngxs/store';
import {DateTime} from 'luxon';
import {ClientState} from '@client/state/client/client.state';

@Component({
  selector: 'schedules',
  standalone: true,
  template: `
    <ul
      role="list"
      class="flex flex-col gap-[32px] border-b border-slate-400 pb-6"
    >
      <li
        *ngFor="let weekDay of weekDayList"
        class="flex items-start justify-between text-gray-200"
      >
        <div class="text-xl font-light">{{ weekDay.name }}</div>
        <div
          class="flex flex-col text-base font-semibold"
          [innerHTML]="getBusinessHour(weekDay, schedules)"
        ></div>
      </li>
    </ul>
  `,
  imports: [NgForOf],
  encapsulation: ViewEncapsulation.None,
})
export class SchedulesComponent implements OnInit {
    @Input({required: true})
  schedules: RISchedule[] = [];

  private readonly translateService = inject(TranslateService);
  private readonly store = inject(Store);

  public readonly weekDayList: {
    id: number;
    name: string;
    translateKey: string;
  }[] = WEEK_DAYS_OBJECTS.map((weekDay) => {
    return {
      ...weekDay,
      translateKey: weekDay.name,
      name: this.translateService.instant(`weekday.long.${weekDay.name}`),
    };
  });

  ngOnInit() {
    this.translateService.onLangChange.subscribe(() => {
      this.weekDayList.forEach((weekDay) => {
        weekDay.name = this.translateService.instant(
          `weekday.long.${weekDay.translateKey}`,
        );
      });
    });
  }

  public getBusinessHour(
    weekDay: { id: number; name: string },
    schedules: RISchedule[],
  ): string {
    const scheduleForWeekDay = schedules.filter((schedule) =>
      schedule.workDays.includes(weekDay.id),
    );

    if (scheduleForWeekDay.length === 0) {
      return this.translateService.instant('keyword.capitalize.closed');
    }

    const fromTimeZone = this.store.selectSnapshot(ClientState.timeZone);
    const baseDateTime = DateTime.fromObject(
      {
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
      },
        {zone: fromTimeZone},
    );

    return scheduleForWeekDay
        .map(({startInSeconds, endInSeconds}) => {
        const startDateTime = baseDateTime
            .plus({seconds: startInSeconds})
          .toLocal();
        const endDateTime = baseDateTime
            .plus({seconds: endInSeconds})
          .toLocal();
        return `<div>${startDateTime.toFormat('HH:mm')} - ${endDateTime.toFormat('HH:mm')}</div>`;
      })
      .join(' ');
  }
}
