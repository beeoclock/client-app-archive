import {Component, inject, Input, ViewEncapsulation} from '@angular/core';
import {NgForOf} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {firstValueFrom, map, Observable} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import * as Client from '@client/domain';

@Component({
  selector: 'social-network-links',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [NgForOf, TranslateModule],
  template: `
    <div class="text-2xl font-semibold text-gray-100">
      {{ 'client.details.section.socialNetwork.title' | translate }}
    </div>
    <div class="flex items-center justify-between pt-4">
      <div class="flex gap-[24px]">
        <a
          *ngFor="let socialNetworkLink of socialNetworkLinks"
          [href]="socialNetworkLink.link"
          target="_blank"
          class="flex h-14 min-h-14 w-14 min-w-14 items-center justify-center rounded-full border bg-gray-200 px-4 py-2 text-slate-800 shadow"
        >
          <i class="bi bi-{{ socialNetworkLink.type }}"></i>
        </a>
      </div>
      <button
        (click)="share()"
        class="flex h-14 min-h-14 w-14 min-w-14 items-center justify-center rounded-full border bg-gray-200 px-4 py-2 text-slate-800 shadow"
      >
        <i class="bi bi-share-fill"></i>
      </button>
    </div>
  `,
})
export class SocialNetworkLinksComponent {
    @Input({required: true})
  socialNetworkLinks: { type: string; link: string }[] = [];

  public readonly activatedRoute = inject(ActivatedRoute);
  public readonly router = inject(Router);

  public readonly item$: Observable<Client.IClient> =
      this.activatedRoute.data.pipe(map(({item}) => item));

  public async share(): Promise<void> {
    const navigator = window.navigator as any;

    if (navigator.share) {
      const item = await firstValueFrom(this.item$);
      navigator.share({
        text: item.description,
        title: item.name,
        url: this.router.url,
      });
    } else {
      navigator.clipboard.writeText(location.href);
    }
  }
}
