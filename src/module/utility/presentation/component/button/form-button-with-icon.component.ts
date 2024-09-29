import {ChangeDetectionStrategy, Component, Input, ViewEncapsulation,} from '@angular/core';
import {NgIf} from '@angular/common';
import {SpinnerComponent} from '@utility/presentation/component/spinner/spinner.component';
import {TranslateModule} from '@ngx-translate/core';

@Component({
  selector: 'form-button-with-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <button
      class="flex items-center justify-center gap-3 rounded-2xl px-4 py-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-beeDarkColor-800"
    >
      <i class="bi bi-plus-lg"></i>
      {{ label }}
    </button>
  `,
  imports: [NgIf, SpinnerComponent, TranslateModule],
})
export class FormButtonWithIconComponent {
  @Input()
  public label = 'LABEL OF BUTTON';
}
