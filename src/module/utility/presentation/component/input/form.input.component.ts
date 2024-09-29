import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  HostBinding,
  inject,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';
import {IsRequiredDirective} from '@utility/presentation/directives/is-required/is-required';
import {InvalidTooltipDirective} from '@utility/presentation/directives/invalid-tooltip/invalid-tooltip.directive';

@Component({
  selector: 'form-input',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IsRequiredDirective,
    InvalidTooltipDirective,
    ReactiveFormsModule,
    NgIf,
  ],
  template: `
    <label
      *ngIf="showLabel"
      [for]="id"
      class="block text-sm font-medium leading-6 text-beeColor-900 dark:text-white"
    >
      {{ label }}
    </label>
    <input
      isRequired
      invalidTooltip
      [isRequiredEnabled]="showLabel"
      [class.disabled]="disabled"
      [formControl]="control"
      [placeholder]="placeholder"
      [id]="id"
      [type]="inputType"
      [autocomplete]="autocomplete"
      class="w-full rounded-md border border-gray-800 bg-gray-800 px-3 py-2 text-white placeholder:text-slate-600"
    />
  `,
})
export class FormInputComponent implements DoCheck {
  @Input()
  public label = 'todo';

  @Input()
  public showLabel = true;

  @Input()
  public id = 'utility-base-input';

  @Input()
  public inputType: string = 'text';

  @Input()
  public placeholder: string = '';

  @Input()
  public autocomplete: string = '';

  @Input()
  public disabled = false;

  @Input()
  public control!: FormControl;

  @HostBinding()
  public class = 'block';

  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  public ngDoCheck(): void {
    this.changeDetectorRef.detectChanges();
  }
}
