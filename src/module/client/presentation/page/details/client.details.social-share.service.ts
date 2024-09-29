import {inject, Injectable} from '@angular/core';
import {filter} from 'rxjs';
import {environment} from '@environments/environment';
import {Reactive} from '@utility/cdk/reactive';
import {Store} from '@ngxs/store';
import {ClientState} from '@client/state/client/client.state';
import {is} from '@utility/checker';
import * as Client from '@client/domain';
import {TranslateService} from '@ngx-translate/core';
import {CountryEnum} from '@utility/domain/enum/country.enum';
import {SocialShareSeoService} from '@utility/cdk/seo/social-share.seo.service';

@Injectable()
export class ClientDetailsSocialShareService extends Reactive {
  private readonly translateService = inject(TranslateService);
  private readonly store = inject(Store);
  private readonly socialShareSeoService = inject(SocialShareSeoService);

  public init() {
    this.translateService.onLangChange.pipe(this.takeUntil()).subscribe(() => {
      this.socialShareSeoService.setLocale(this.translateService.currentLang);
    });

    this.store
      .select(ClientState.item)
      .pipe(filter(is.not_null<Client.IClient>))
      .pipe(this.takeUntil())
      .subscribe((item) => {
        if (item.logo) {
          this.socialShareSeoService.setImage(item.logo.url, {
            alt: item.name,
            height: item.logo.metadata.height,
            width: item.logo.metadata.width,
            mimeType: 'image/jpg',
            secureUrl: item.logo.url,
          });
        }

        if (item.banners?.length) {
          this.socialShareSeoService.setCard('summary_large_image');
          // TODO: set image
        } else {
          this.socialShareSeoService.setCard('summary');
        }

        this.socialShareSeoService.setUrl(
          environment.url.self +
            '/' +
            this.translateService.currentLang +
            '/' +
            (item.username ?? item._id),
        );
        this.socialShareSeoService.setSiteCreator('@beeoclock.biz');
        this.socialShareSeoService.setType('website');
        this.socialShareSeoService.setTitle(item.name);
        this.socialShareSeoService.setDescription(
          item.description ??
            this.translateService.instant(
                'seo.page.client.details.default.description',
                {businessName: item.name},
            ),
        );
        this.socialShareSeoService.setAuthor('Bee O`clock');
        this.socialShareSeoService.setSubTitle('Powered by Bee O`clock');
        this.socialShareSeoService.setLocale(this.translateService.currentLang);
        this.socialShareSeoService.setLocaleAlternate(
          item.businessSettings.availableLanguages.filter((language) => {
            return language !== this.translateService.currentLang;
          }),
        );

        if (item.addresses?.length > 0) {
          const {
            country,
            streetAddressLineOne,
            streetAddressLineTwo,
            zipCode,
            city,
          } = item.addresses[0];

          this.socialShareSeoService.setPostalCode(zipCode);
          this.socialShareSeoService.setStreetAddress(
            streetAddressLineOne + ' ' + streetAddressLineTwo,
          );
          this.socialShareSeoService.setLocality(city);
          this.socialShareSeoService.setRegion(country);
          this.socialShareSeoService.setCountryName(
            CountryEnum[country as any as keyof typeof CountryEnum],
          );
        }
      });
  }
}
