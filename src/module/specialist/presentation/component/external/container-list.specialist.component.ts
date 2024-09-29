import {Component, inject, ViewEncapsulation} from '@angular/core';
import {AsyncPipe, CurrencyPipe, NgForOf} from '@angular/common';
import {Store} from '@ngxs/store';
import {SpecialistState} from '@specialist/state/member/specialist.state';

@Component({
  selector: 'container-list-specialist-component',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [NgForOf, AsyncPipe, CurrencyPipe],
  template: `
    <ul role="list" class="flex flex-col">
      <li
        *ngFor="let specialist of list$ | async"
        class="cursor-pointer py-[32px] transition"
      >
        <a href="/service/details">
          <div class="flex items-center gap-[32px] space-x-4">
            <div class="flex-shrink-0 text-7xl">
              <i
                class="bi bi-person-circle h-[128px] w-[128px] text-neutral-300"
              ></i>

              <!--              <img class="h-[128px] w-[128px] object-cover rounded-lg"-->
              <!--                   [src]="specialist"-->
              <!--                   alt="Hotel Photo"/>-->
            </div>
            <div class="flex flex-col gap-[16px]">
              <!--              <div class="font-bold text-[28px]">-->
              <!--                {{ specialist.member?.firstName ?? '' }} {{ specialist.member?.lastName ?? '' }}-->
              <!--              </div>-->
              <!--              <div class="text-[#828282] text-[24px] leading-tight">-->
              <!--                {{ specialist.member?.email ?? '' }}-->
              <!--              </div>-->
            </div>
            <div
              class="inline-flex flex-col items-center gap-8 text-base font-semibold text-neutral-900 dark:text-white"
            >
              <a
                href=""
                class="flex w-[162px] items-center justify-center rounded-full bg-[#FFB60A] px-6 py-3 text-[24px] font-bold hover:underline"
              >
                Book <i class="bi bi-chevron-right"></i>
              </a>
            </div>
          </div>
        </a>
      </li>
    </ul>
  `,
})
export class ContainerListSpecialistComponent {
  private readonly store = inject(Store);
  public readonly list$ = this.store.select(SpecialistState.items);
}
