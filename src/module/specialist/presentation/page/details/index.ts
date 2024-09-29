import {Component, HostBinding, inject, ViewEncapsulation,} from '@angular/core';
import {RouterLink} from '@angular/router';
import {AsyncPipe, NgIf} from '@angular/common';
import {CardComponent} from '@utility/presentation/component/card/card.component';
import {BodyCardComponent} from '@utility/presentation/component/card/body.card.component';
import {BackLinkComponent} from '@utility/presentation/component/link/back.link.component';
import {SpinnerComponent} from '@utility/presentation/component/spinner/spinner.component';
import {LoaderComponent} from '@utility/presentation/component/loader/loader.component';
import {TranslateModule} from '@ngx-translate/core';
import {Store} from '@ngxs/store';

@Component({
  selector: 'specialist-detail-page',
  template: ` Hello, you have something to do here `,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CardComponent,
    BodyCardComponent,
    NgIf,
    AsyncPipe,
    SpinnerComponent,
    BackLinkComponent,
    BodyCardComponent,
    BackLinkComponent,
    RouterLink,
    LoaderComponent,
    TranslateModule,
  ],
  standalone: true,
})
export default class Index {
  @HostBinding()
  public readonly class = 'block';

  public readonly store = inject(Store);
}
