import {ChangeDetectionStrategy, Component, inject, Input, OnInit, ViewEncapsulation,} from '@angular/core';
import {CurrencyCodeEnum} from '@utility/domain/enum';
import {NgSelectModule} from '@ng-select/ng-select';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {NgxMaskDirective} from 'ngx-mask';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {LanguageCurrency} from '@utility/domain/const/c.language-currency';
import {InvalidTooltipDirective} from '@utility/presentation/directives/invalid-tooltip/invalid-tooltip.directive';
import {HasErrorDirective} from '@utility/presentation/directives/has-error/has-error.directive';

@Component({
  selector: 'price-and-currency-component',
  standalone: true,
  template: `
    <label
      class="block text-sm font-medium leading-6 text-beeColor-900 dark:text-beeDarkColor-300 dark:text-white"
      [for]="prefix + 'price'"
      >{{ 'keyword.capitalize.price' | translate }}</label
    >
    <div class="flex">
      <input
        [id]="prefix + 'price'"
        [formControl]="priceControl"
        mask="separator.2"
        type="text"
        hasError
        invalidTooltip
        [placeholder]="'keyword.capitalize.writePrice' | translate"
        class="block w-full min-w-0 flex-1 rounded-none rounded-l border border-beeColor-300 px-3 py-2 text-sm text-beeColor-900 focus:border-blue-500 focus:ring-blue-500 dark:border-beeDarkColor-600 dark:bg-beeDarkColor-700 dark:text-white dark:placeholder-beeDarkColor-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
      />
      <span
        class="inline-flex items-center rounded-r border border-l-0 border-beeColor-300 bg-beeColor-200 text-sm text-beeColor-900 dark:border-beeDarkColor-600 dark:bg-beeDarkColor-600 dark:text-beeDarkColor-400"
      >
        <ng-select
          style="width: 100px"
          class="border-0"
          bindLabel="name"
          bindValue="id"
          [items]="currencyList"
          [clearable]="false"
          [id]="prefix + 'currency'"
          [formControl]="currencyControl"
        >
        </ng-select>
      </span>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  imports: [
    NgSelectModule,
    ReactiveFormsModule,
    InvalidTooltipDirective,
    HasErrorDirective,
    NgxMaskDirective,
    TranslateModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PriceAndCurrencyComponent implements OnInit {
  @Input()
  public prefix: string = '';

  @Input()
  public currencyControl = new FormControl();

  @Input()
  public priceControl = new FormControl();

  public readonly translateService = inject(TranslateService);

  public readonly currencyList = Object.values(CurrencyCodeEnum).map(
    (currency) => ({
      id: currency,
      name: currency,
    }),
  );

  public ngOnInit(): void {
    this.currencyControl.setValue(
      LanguageCurrency[
        this.translateService.currentLang as keyof typeof LanguageCurrency
          ],
    );
  }
}
