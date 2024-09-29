import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import {NgClass, NgForOf} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {TabTypes} from '@client/domain/enum/tab-type.enum';

@Component({
  selector: 'tab-menu',
  standalone: true,
  template: `
    <ul class="-mb-px flex justify-start text-xl">
      <li
        *ngFor="let tabMenuItem of tabMenuItems"
        class="me-2 inline-block cursor-pointer rounded-t-lg border-b-2 p-4"
        [ngClass]="classMapOfActiveState[getState(tabMenuItem.value)]"
        (click)="selectedTabChange.emit(tabMenuItem.value)"
      >
        {{ tabMenuItem.labelTranslateKey | translate }}
      </li>
    </ul>
  `,
  imports: [NgForOf, TranslateModule, NgClass],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabMenuComponent {
  @Input()
  tabMenuItems: { labelTranslateKey: string; value: TabTypes }[] = [];

  @Input()
  selectedTab: TabTypes = TabTypes.services;

  @Output()
  selectedTabChange = new EventEmitter<TabTypes>();

  @HostBinding()
  public class =
    'font-semibold w-full text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700';

  public readonly classMapOfActiveState = {
    active:
      'border-yellow-400 text-yellow-400 dark:text-yellow-400 dark:border-yellow-400 active',
    inactive:
      'hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 border-transparent',
  };

  public getState(value: string) {
    return value === this.selectedTab ? 'active' : 'inactive';
  }
}
