import {ChangeDetectionStrategy, Component, Input, ViewEncapsulation,} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {NgxMaskDirective} from 'ngx-mask';
import {InvalidTooltipDirective} from '@utility/presentation/directives/invalid-tooltip/invalid-tooltip.directive';
import {HasErrorDirective} from '@utility/presentation/directives/has-error/has-error.directive';

@Component({
  selector: 'form-badge-input',
  standalone: true,
  template: `
    <label
      class="block text-sm font-medium leading-6 text-beeColor-900 dark:text-beeDarkColor-300 dark:text-white"
      [for]="id"
      >{{ label }}</label
    >
    <div class="flex">
      <input
        [id]="id"
        [formControl]="control"
        [placeholder]="placeholder"
        [mask]="mask"
        [dropSpecialCharacters]="false"
        type="text"
        hasError
        invalidTooltip
        class="block w-full min-w-0 flex-1 rounded-none rounded-l border border-beeColor-300 px-3 py-2 text-sm text-beeColor-900 focus:border-blue-500 focus:ring-blue-500 dark:border-beeDarkColor-600 dark:bg-beeDarkColor-700 dark:text-white dark:placeholder-beeDarkColor-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
      />
      <span
        class="inline-flex items-center rounded-r border border-l-0 border-beeColor-300 bg-beeColor-100 px-3 text-sm text-beeColor-500 dark:border-beeDarkColor-600 dark:bg-beeDarkColor-600 dark:text-beeDarkColor-400"
      >
        {{ badge }}
      </span>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  imports: [
    ReactiveFormsModule,
    InvalidTooltipDirective,
    HasErrorDirective,
    NgxMaskDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputBadgeComponent {
  @Input()
  public placeholder: string = '';

  @Input()
  public label: string = '';

  @Input()
  public mask: string = '';

  @Input()
  public id: string = '';

  @Input()
  public badge: string = '';

  @Input()
  public control = new FormControl();
}
