import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation,} from '@angular/core';
import {NgIf} from '@angular/common';
import {SpinnerComponent} from '@utility/presentation/component/spinner/spinner.component';
import {TranslateModule} from '@ngx-translate/core';

@Component({
  selector: 'delete-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <button
      type="button"
      (click)="event.emit($event)"
      [class.w-full]="buttonWidthFull"
      class="flex items-center justify-center rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-red-500 shadow-sm ring-1 ring-inset ring-beeColor-300 hover:bg-beeColor-50 dark:bg-beeDarkColor-800 dark:ring-red-700 dark:hover:bg-red-800 dark:hover:text-red-200 hover:dark:ring-red-700"
    >
      <i class="bi bi-trash me-2"></i>
      {{ 'keyword.capitalize.delete' | translate }}
    </button>
  `,
  imports: [NgIf, SpinnerComponent, TranslateModule],
})
export class DeleteButtonComponent {
  @Input()
  public buttonWidthFull = false;

  @Output()
  public readonly event = new EventEmitter<Event>();
}
