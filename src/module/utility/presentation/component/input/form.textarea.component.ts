import {Component, HostBinding, Input} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {InvalidTooltipDirective} from '@utility/presentation/directives/invalid-tooltip/invalid-tooltip.directive';

@Component({
  selector: 'form-textarea-component',
  standalone: true,
  imports: [TranslateModule, InvalidTooltipDirective, ReactiveFormsModule],
  template: `
    <label
      [for]="id"
      class="block text-sm font-medium leading-6 text-beeColor-900 dark:text-white"
    >
      {{ label }}
    </label>
    <div class="flex flex-col">
      <textarea
        invalidTooltip
        class="min-h-[90px] w-full rounded-md border border-gray-800 bg-gray-800 px-3 py-2 text-white placeholder:text-slate-600"
        [rows]="rows"
        [placeholder]="placeholder"
        [id]="id"
        [formControl]="control"
      ></textarea>
    </div>
  `,
})
export class FormTextareaComponent {
  @Input()
  public control!: FormControl<string>;

  @Input()
  public label = 'Label';

  @Input()
  public placeholder = '';

  @Input()
  public id = '';

  @Input()
  public rows = 3;

  @HostBinding()
  public class = 'block';
}
