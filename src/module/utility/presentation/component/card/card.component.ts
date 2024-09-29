import {Component, Input, ViewEncapsulation} from '@angular/core';
import {NgClass, NgIf} from '@angular/common';

@Component({
  selector: 'card',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [NgIf, NgClass],
  template: `
    <div
      class="flex flex-col rounded-2xl border bg-white dark:bg-beeDarkColor-800/50 dark:text-white"
      [ngClass]="[
        'gap-' + gap,
        'w-' + width,
        'p-' + padding,
        borderColor,
        'dark:' + darkBorderColor,
      ]"
    >
      <ng-content></ng-content>
    </div>
  `,
})
export class CardComponent {
  @Input()
  public gap: '0' | '4' | '1' | '2' | '3' | '8' = '4';

  @Input()
  public padding: '0' | '4' | '1' | '2' | '3' | '8' = '4';

  @Input()
  public width: 'auto' | '96' | string = 'auto';

  @Input()
  public borderColor: string = 'border-beeColor-200';

  @Input()
  public darkBorderColor: string = 'border-beeDarkColor-700';
}
