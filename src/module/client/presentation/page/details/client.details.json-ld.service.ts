import {inject, Injectable} from '@angular/core';
import {combineLatest, filter} from 'rxjs';
import {ServiceState} from '@service/state/service/service.state';
import {JsonLdObjectTypeEnum, JsonLdService, Offer,} from '@utility/cdk/seo/json-ld/json-ld.service';
import {WEEK_WITH_CAPITALIZE_NAME} from '@utility/domain/enum';
import {RILanguageVersion} from '@module/service';
import {environment} from '@environments/environment';
import {Reactive} from '@utility/cdk/reactive';
import {Store} from '@ngxs/store';
import {ClientState} from '@client/state/client/client.state';
import {is} from '@utility/checker';
import * as Client from '@client/domain';
import {TranslateService} from '@ngx-translate/core';
import {ConvertTool} from '@src/module/utility/convert.tool';
import {DateTime} from 'luxon';

@Injectable()
export class ClientDetailsJsonLdService extends Reactive {
  private readonly translateService = inject(TranslateService);
  private readonly jsonLdService = inject(JsonLdService);
  public readonly store = inject(Store);

  public init() {
    combineLatest([
      this.store
        .select(ClientState.item)
        .pipe(filter(is.not_null<Client.IClient>)),
      this.store.select(ServiceState.items),
    ])
      .pipe(this.takeUntil())
        .subscribe(({0: businessClient, 1: services}) => {
        let jsonLd = this.jsonLdService.getObject(
          JsonLdObjectTypeEnum.LocalBusiness,
          {
            name: businessClient.name,
            image: businessClient.logo?.url ?? '',
            telephone: `+${businessClient.contacts[0].countryCode}${businessClient.contacts[0].phoneNumber}`,
          },
        );

        const baseDateTime = DateTime.fromObject(
          {
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          },
            {zone: businessClient.businessSettings.timeZone},
        );

        // openingHoursSpecification
        jsonLd = this.jsonLdService.addOpeningHours(
          jsonLd,
          businessClient.schedules.map(
              ({workDays, startInSeconds, endInSeconds}) => {
              const startDateTime = baseDateTime.plus({
                seconds: startInSeconds,
              });
                  const endDateTime = baseDateTime.plus({seconds: endInSeconds});

              return {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: workDays.map(
                  (dayNumber) => WEEK_WITH_CAPITALIZE_NAME[dayNumber],
                ),
                opens: startDateTime.toFormat('HH:mm'),
                closes: endDateTime.toFormat('HH:mm'),
              };
            },
          ),
        );

        // sameAs
        jsonLd = this.jsonLdService.addSameAs(
          jsonLd,
            businessClient.socialNetworkLinks.map(({link}) => link),
        );

        // Address
        if (businessClient.addresses?.length > 0) {
          const address = businessClient.addresses[0];
          jsonLd = this.jsonLdService.addAddress(jsonLd, {
            '@type': 'PostalAddress',
            streetAddress: `${address.streetAddressLineOne} ${address.streetAddressLineTwo}`,
            postalCode: address.zipCode,
            addressLocality: address.city,
            addressCountry: address.country,
          });
        }

        // Services
        if (services.length) {
          const jsonLDService: Offer[] = services.map((service) => {
            const defaultLanguageVersion = service.languageVersions[0];
              const {title, description} = (service.languageVersions.find(
                  ({language}) => language === this.translateService.currentLang,
            ) ?? defaultLanguageVersion) as RILanguageVersion;
            const durationDocument = service.durationVersions?.[0];
            const priceDocument = durationDocument?.prices?.[0];
            const price = priceDocument?.price?.toString() ?? '';
            const priceCurrency = priceDocument?.currency ?? '';
            const duration = durationDocument?.durationInSeconds;

            return {
              '@type': 'Offer',
              name: title,
              itemOffered: {
                '@type': 'CreativeWork',
                name: title,
                description,
                timeRequired: ConvertTool.secondsToIso8601Duration(duration),
              },
              price,
              priceCurrency,
              url: `${environment.url.self}/${this.translateService.currentLang}/${businessClient.username}`,
            };
          });
          jsonLd = this.jsonLdService.addMakesOffer(jsonLd, jsonLDService);
        }

        this.jsonLdService.inject(jsonLd);
      });
  }
}
