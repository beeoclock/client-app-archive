import {Component, Input, OnInit} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {ISocialNetworkLink} from '@client/domain/interface';
import {RIAddress} from '@client/domain/interface/i.address';
import {TranslateModule} from '@ngx-translate/core';
import {RouterLink} from '@angular/router';
import {RIMedia} from '@module/media/domain/interface/i.media';

@Component({
  selector: 'utility-header-v2-component',
  standalone: true,
  imports: [NgIf, NgForOf, TranslateModule, RouterLink],
  template: `
    <!-- Header -->
    <header
      class="charlie-brown relative mb-4 h-[700px] overflow-hidden pt-24 md:pt-16"
    >
      <img
        *ngIf="banner"
        [src]="banner.url"
        class="absolute left-0 top-0 z-10 h-full w-full object-cover"
      />

      <div
        class="absolute left-1/2 top-1/2 z-20 w-full -translate-x-1/2 -translate-y-1/2 transform text-center md:max-w-4xl"
      >
        <div *ngIf="logo" class="mb-4 flex justify-center">
          <img class="h-20 w-20 object-cover" [src]="logo?.url" />
        </div>

        <div class="mb-4 text-[24px] text-white">
          {{ title }}
        </div>

        <div class="mb-16" *ngIf="socialNetworkLinks?.length">
          <a
            *ngFor="let socialNetworkLink of socialNetworkLinks"
            [href]="socialNetworkLink.link"
            target="_blank"
            class="mr-2 rounded-2xl bg-white px-3 py-2 text-gray-600"
          >
            <i class="bi bi-{{ socialNetworkLink.type }}"></i>
          </a>
        </div>

        <div class="mb-6 text-[24px]">
          <span class="text-white" *ngIf="address">
            {{ address?.streetAddressLineOne ?? '' }}
            {{ address?.streetAddressLineTwo ?? '' }} ,
            {{ address?.city ?? '' }},
            {{ 'country.' + address?.country | translate }},
            {{ address?.zipCode ?? '' }}
          </span>
          <span class="text-2xl text-yellow-400">
            <i class="bi bi-geo-alt"></i>
          </span>
          <span class="text-gray-400">
            {{ feature }}
          </span>
        </div>

        <h1 class="mb-12 text-[64px] text-white">
          {{ description }}
        </h1>

        <div class="mb-4">
          <a
            routerLink="."
            fragment="section-service"
            class="rounded-2xl bg-[#FFB60A] px-8 py-3 text-[24px] font-bold"
          >
            {{ 'keyword.capitalize.bookNow' | translate }}
            <i class="bi bi-chevron-right"></i>
          </a>
        </div>
      </div>
    </header>
  `,
})
export class HeaderV2Component implements OnInit {
  @Input()
  public title = 'Curly Barber Shop';

  @Input()
  public banner: RIMedia | null | undefined;

  @Input()
  public logo: RIMedia | null | undefined;

  @Input()
  public address: RIAddress | undefined;

  @Input()
  public feature: string | undefined;

  @Input()
  public description: string | undefined;

  @Input()
  public socialNetworkLinks: ISocialNetworkLink[] | undefined;

  public ngOnInit(): void {
    console.log('HeaderV2Component.ngOnInit', this.logo);
  }
}
