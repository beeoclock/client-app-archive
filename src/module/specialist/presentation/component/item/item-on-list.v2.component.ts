import {Component, HostBinding, inject, Input, ViewEncapsulation,} from '@angular/core';
import {NgIf} from '@angular/common';
import {DurationVersionHtmlHelper} from '@utility/helper/duration-version.html.helper';
import {IService} from '@module/service';

@Component({
  selector: 'item-on-list-v2',
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
        class="text-md line-clamp-2 font-semibold leading-tight text-gray-100"
      >
        {{ service.languageVersions[0].title }}
      </div>
      <div class="flex gap-2">
        <div
          [innerHTML]="durationVersionHtmlHelper.getPriceValueV2(service)"
          class="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-sm font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
        ></div>
        <div
          [innerHTML]="durationVersionHtmlHelper.getDurationValueV2(service)"
          class="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-sm font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
        ></div>
      </div>
    </div>
  `,
  standalone: true,
  imports: [NgIf],
  encapsulation: ViewEncapsulation.None,
})
export class ItemOnListV2Component {
  @Input()
  public service!: IService;

  @HostBinding()
  public class = 'justify-start items-center gap-4 inline-flex w-full';

  public readonly durationVersionHtmlHelper = inject(DurationVersionHtmlHelper);
}