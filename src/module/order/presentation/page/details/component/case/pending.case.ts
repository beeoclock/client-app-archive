import {ChangeDetectionStrategy, Component, ViewEncapsulation} from "@angular/core";
import {TranslateModule} from "@ngx-translate/core";
import {NgIf, NgSwitchCase} from "@angular/common";
import {OrderDetailsComponent} from "@order/presentation/page/details/component/details.component";
import {BaseCaseComponent} from "@order/presentation/page/details/component/case/base.case";

@Component({
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'order-details-pending-case',
  imports: [
    TranslateModule,
    NgIf,
    NgSwitchCase,
    OrderDetailsComponent
  ],
  template: `
      <div class="px-3 sm:px-0">
          <div
              class="mb-4 text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl lg:text-6xl"
          >
              <div class="">
                  {{ 'event.details.status.cancelled.title' | translate }}
              </div>
          </div>
          <div class="text-base font-normal text-gray-200 lg:text-xl">
              {{ 'event.details.status.cancelled.hint' | translate }}
          </div>
      </div>
      <order-details-component [item]="item"/>
  `
})
export class OrderDetailsPendingCaseComponent extends BaseCaseComponent {

}