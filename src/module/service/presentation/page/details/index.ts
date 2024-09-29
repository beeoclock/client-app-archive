import {Component, HostBinding, inject, ViewEncapsulation,} from '@angular/core';
import {RouterLink} from '@angular/router';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {LanguagePipe} from '@utility/presentation/pipe/language.pipe';
import {WeekDayPipe} from '@utility/presentation/pipe/week-day.pipe';
import {TranslateModule} from '@ngx-translate/core';
import {Store} from '@ngxs/store';
import {BackLinkComponent} from '@utility/presentation/component/link/back.link.component';

@Component({
  selector: 'service-detail-page',
  template: ` Hello, you have something to do here `,
  encapsulation: ViewEncapsulation.None,
  imports: [
    NgIf,
    AsyncPipe,
    RouterLink,
    NgForOf,
    LanguagePipe,
    WeekDayPipe,
    TranslateModule,
    BackLinkComponent,
  ],
  standalone: true,
})
export default class Index {
  @HostBinding()
  public readonly class = 'block';

  public readonly store = inject(Store);
}
