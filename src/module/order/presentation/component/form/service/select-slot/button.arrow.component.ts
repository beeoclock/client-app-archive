import {ChangeDetectionStrategy, Component, Input, ViewEncapsulation,} from '@angular/core';

@Component({
  selector: 'event-select-slot-button-arrow-component',
  template: `
    <button
      type="button"
      [disabled]="disabled"
      class="cursor-pointer rounded-2xl px-3 py-2 duration-100 hover:bg-white/20 active:scale-95"
    >
      <i
        class="bi"
        [class.bi-chevron-left]="left"
        [class.bi-chevron-right]="right"
      ></i>
    </button>
  `,
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonArrowComponent {
  @Input()
  public left = false;

  @Input()
  public right = false;

  @Input()
  public disabled = false;
}
