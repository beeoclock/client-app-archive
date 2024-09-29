import {Component, HostBinding, inject, Input, ViewEncapsulation,} from '@angular/core';
import {NgIf} from '@angular/common';
import {DurationVersionHtmlHelper} from '@utility/helper/duration-version.html.helper';
import {IService} from '@module/service';

@Component({
  selector: 'item-on-list',
  template: `
    <div *ngIf="service?.presentation?.banners?.[0]?.url?.length">
      <img
        class="h-14 w-14 rounded-lg shadow"
        [src]="service.presentation?.banners?.[0]?.url"
        alt="Service image"
      />
    </div>
    <div
      class="inline-flex shrink grow basis-0 flex-col items-start justify-start gap-1 self-stretch"
    >
      <div
        class="text-md line-clamp-3 text-left font-semibold leading-tight text-gray-100"
      >
        {{ service.languageVersions[0].title }}
      </div>
    </div>
    <div class="inline-flex flex-col items-end justify-center self-stretch">
      <div
        class="text-md text-right font-semibold leading-tight text-gray-100"
        [innerHTML]="durationVersionHtmlHelper.getPriceValueV2(service)"
      ></div>
      <div
        class="text-right text-base font-normal leading-tight text-slate-400"
        [innerHTML]="durationVersionHtmlHelper.getDurationValueV2(service)"
      ></div>
    </div>
  `,
  standalone: true,
  imports: [NgIf],
  encapsulation: ViewEncapsulation.None,
})
export class ItemOnListComponent {
  @Input()
  public service!: IService;

  @HostBinding()
  public class = 'justify-start items-center gap-4 inline-flex w-full';

  public readonly durationVersionHtmlHelper = inject(DurationVersionHtmlHelper);
}
