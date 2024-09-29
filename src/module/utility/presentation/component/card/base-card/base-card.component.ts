import {Component, Input} from '@angular/core';
import {NgClass} from '@angular/common';

@Component({
  standalone: true,
  selector: 'utility-card',
  imports: [NgClass],
  template: `
    <div
      class="w-full rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
      [ngClass]="padding"
    >
      <div [class]="headerClassList">
        <ng-content select="[header]"></ng-content>
      </div>
      <ng-content select="[body]"></ng-content>
    </div>
  `,
})
export class BaseCardComponent {
  @Input()
  public padding = 'p-4 sm:p-8';

  @Input()
  public headerClassList = 'uppercase pb-6 text-xl font-bold border-b';
}
