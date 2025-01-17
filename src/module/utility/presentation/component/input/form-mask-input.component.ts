import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {IsRequiredDirective} from '@utility/presentation/directives/is-required/is-required';
import {InvalidTooltipDirective} from '@utility/presentation/directives/invalid-tooltip/invalid-tooltip.directive';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {NgxMaskDirective} from 'ngx-mask';

@Component({
  selector: 'form-mask-input',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    IsRequiredDirective,
    InvalidTooltipDirective,
    ReactiveFormsModule,
    NgxMaskDirective,
  ],
  template: `
    <label
      [for]="id"
      class="block text-sm font-medium leading-6 text-beeColor-900 dark:text-beeDarkColor-300 dark:text-white"
    >
      {{ label }}
    </label>
    <input
      isRequired
      invalidTooltip
      [mask]="mask"
      [dropSpecialCharacters]="dropSpecialCharacters"
      [disabled]="disabled"
      [formControl]="localControl"
      [placeholder]="placeholder"
      [id]="id"
      [type]="type"
      [autocomplete]="autocomplete"
      class="block w-full rounded-md border border-beeColor-300 px-3 py-1.5 text-beeColor-900 placeholder:text-beeColor-400 focus:border-beeColor-800 dark:bg-beeDarkColor-700 dark:text-beeDarkColor-100 sm:text-sm sm:leading-6"
    />
  `,
})
export class FormInputComponent implements OnInit {
  @Input()
  public mask = '';

  @Input()
  public dropSpecialCharacters = false;

  @Input()
  public label = 'todo';

  @Input()
  public id = 'utility-base-input';

  @Input()
  public type: string = 'text';

  @Input()
  public placeholder: string = '';

  @Input()
  public autocomplete: string = '';

  @Input()
  public disabled = false;

  @Input()
  public control!: FormControl;

  @Input()
  public convertIn: (value: any) => any = (a) => a;

  @Input()
  public convertOut: (value: any) => any = (a) => a;

  public readonly localControl = new FormControl();

  public ngOnInit(): void {
    this.localControl.patchValue(this.convertIn(this.control.value));

    this.control.valueChanges.subscribe((value) => {
      this.localControl.patchValue(this.convertIn(value), {
        emitEvent: false,
        onlySelf: true,
      });
    });

    this.localControl.valueChanges.subscribe((value) => {
      this.control.patchValue(this.convertOut(value), {
        emitEvent: false,
        onlySelf: true,
      });
    });
  }
}
