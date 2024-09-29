import {ChangeDetectionStrategy, Component, HostBinding, ViewEncapsulation,} from '@angular/core';
import {CartServiceDetails, CartState} from '@order/state/cart/cart.state';
import {RouterLink} from '@angular/router';
import {CurrencyCodeEnum} from '@utility/domain/enum';
import {CurrencyPipe} from '@angular/common';
import {SelectSnapshot} from '@ngxs-labs/select-snapshot';
import {TranslateModule} from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'cart-button-component',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex justify-between">
      <div class="text-lg font-bold">
        {{ totalAmount | currency: currencyCode }}
      </div>
      <div>
          {{ 'keyword.capitalize.items' | translate }}: {{ services?.length ?? 0 }}
      </div>
    </div>
    <a
        [routerLink]="['order', 'cart']"
        class="flex w-full items-center justify-center space-x-2 rounded bg-yellow-500 px-4 py-2 uppercase text-yellow-900 shadow transition-all duration-100 active:scale-95"
    >
      <i class="bi bi-basket text-lg"></i>
      <div>{{ 'keyword.capitalize.openCart' | translate }}</div>
    </a>
  `,
  imports: [RouterLink, CurrencyPipe, TranslateModule],
})
export class CartButtonComponent {
  @HostBinding()
  public class = 'w-full rounded-lg bg-slate-800 p-4 flex flex-col gap-2';

  @HostBinding('class.hidden')
  @SelectSnapshot(CartState.isEmpty)
  public cartIsEmpty!: boolean;

  @SelectSnapshot(CartState.getTotalAmount)
  public totalAmount!: number;

  @SelectSnapshot(CartState.getCurrency)
  public currencyCode!: CurrencyCodeEnum;

  @SelectSnapshot(CartState.getServices)
  public services!: CartServiceDetails[];
}
