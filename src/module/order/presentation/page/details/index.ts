import {Component, inject, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FooterV2Component} from '@utility/presentation/component/footer/v2/footer-v2.component';
import {BackLinkComponent} from '@utility/presentation/component/link/back.link.component';
import {CardComponent} from '@utility/presentation/component/card/card.component';
import {AsyncPipe, CurrencyPipe, NgForOf, NgIf, NgSwitch, NgSwitchCase, NgTemplateOutlet,} from '@angular/common';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import * as Client from '@client/domain';
import {IClient} from '@client/domain';
import {DynamicDatePipe} from '@utility/presentation/directives/dynamic-date.pipe';
import {AddToCalendarModule,} from '@utility/library/add-to-calendar';
import {HumanizeDurationPipe} from '@utility/presentation/pipe/humanize-duration.pipe';
import {DurationVersionHtmlHelper} from '@utility/helper/duration-version.html.helper';
import {ChangeLanguageComponent} from '@utility/presentation/component/change-language/change-language.component';
import {CLIENT_ID} from '@src/token';
import {ItemOnListComponent} from '@specialist/presentation/component/item/item-on-list.component';
import {OrderStatusEnum} from '@order/domain/enum/order.status.enum';
import {PublicOrderDto} from '@order/domain/dto/public-order.dto';
import {filter, map} from "rxjs";
import {ClientState} from "@client/state/client/client.state";
import {is} from '@utility/checker';
import {Store} from "@ngxs/store";
import {OrderDetailsCancelledCaseComponent} from "@order/presentation/page/details/component/case/cancelled.case";
import {OrderDetailsConfirmedCaseComponent} from "@order/presentation/page/details/component/case/confirmed.case";
import {OrderDetailsDoneCaseComponent} from "@order/presentation/page/details/component/case/done.case";
import {OrderDetailsPendingCaseComponent} from "@order/presentation/page/details/component/case/pending.case";
import {OrderDetailsRequestedCaseComponent} from "@order/presentation/page/details/component/case/requested.case";
import {OrderDetailsDraftCaseComponent} from "@order/presentation/page/details/component/case/draft.case";

@Component({
  selector: 'event-detail-page',
  templateUrl: './index.html',
  providers: [CurrencyPipe, DurationVersionHtmlHelper],
  encapsulation: ViewEncapsulation.None,
  imports: [
    FooterV2Component,
    BackLinkComponent,
    CardComponent,
    TranslateModule,
    DynamicDatePipe,
    NgIf,
    CurrencyPipe,
    NgForOf,
    AddToCalendarModule,
    HumanizeDurationPipe,
    AsyncPipe,
    ChangeLanguageComponent,
    NgSwitchCase,
    NgTemplateOutlet,
    NgSwitch,
    ItemOnListComponent,
    OrderDetailsCancelledCaseComponent,
    OrderDetailsConfirmedCaseComponent,
    OrderDetailsDoneCaseComponent,
    OrderDetailsPendingCaseComponent,
    OrderDetailsRequestedCaseComponent,
    OrderDetailsDraftCaseComponent,
  ],
  standalone: true,
})
export default class Index {
  public readonly durationVersionHtmlHelper = inject(DurationVersionHtmlHelper);
  private readonly translateService = inject(TranslateService);
  private readonly activatedRoute = inject(ActivatedRoute);
  public readonly store = inject(Store);
  public readonly CLIENT_ID$ = inject(CLIENT_ID);
  public readonly item$ = this.store
    .select(ClientState.item)
    .pipe(filter(is.not_null<Client.IClient>));
  public readonly logo$ = this.item$.pipe(
      map((item) => item.logo?.url ?? '/assets/logo.png'),
  );

  public readonly item: PublicOrderDto = this.activatedRoute.snapshot.data['item'];
  public readonly client: IClient = this.activatedRoute.snapshot.data['client'];
  public readonly status = OrderStatusEnum;


}
