import {ChangeDetectionStrategy, Component, inject, OnInit, ViewEncapsulation} from '@angular/core';
import {delay, filter, map, Observable} from 'rxjs';
import * as Client from '@client/domain';
import {AsyncPipe, DOCUMENT, NgIf, NgSwitch, NgSwitchCase,} from '@angular/common';
import {RIAddress} from '@client/domain/interface/i.address';
import {TabTypes} from '@src/module/client/domain/enum/tab-type.enum';
import {ChangeLanguageComponent} from '@utility/presentation/component/change-language/change-language.component';
import {DetailsComponent} from '@client/presentation/page/details/components/details/details.component';
import {TabMenuComponent} from '@client/presentation/page/details/components/tab-menu/tab-menu.component';
import {Store} from '@ngxs/store';
import {ClientState} from '@client/state/client/client.state';
import {is} from '@utility/checker';
import {TranslateService} from '@ngx-translate/core';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {Reactive} from '@utility/cdk/reactive';
import {ClientDetailsJsonLdService} from '@client/presentation/page/details/client.details.json-ld.service';
import {ClientDetailsSocialShareService} from '@client/presentation/page/details/client.details.social-share.service';
import {ServiceState} from '@service/state/service/service.state';
import {IService} from '@module/service';
import {NGXLogger} from 'ngx-logger';
import {ActivatedRoute, Router} from '@angular/router';
import {ServiceListComponent} from '@order/presentation/component/form/service/service-list/service-list.component';
import {CartActions} from '@order/state/cart/cart.actions';
import {Dispatch} from '@ngxs-labs/dispatch-decorator';
import {CartButtonComponent} from '@client/presentation/page/details/components/cart-button/cart-button.component';

@Component({
    selector: 'client-details-page',
    standalone: true,
    imports: [
        AsyncPipe,
        NgIf,
        NgSwitch,
        NgSwitchCase,
        ChangeLanguageComponent,
        DetailsComponent,
        TabMenuComponent,
        ServiceListComponent,
        CartButtonComponent,
    ],
    providers: [ClientDetailsJsonLdService, ClientDetailsSocialShareService],
    templateUrl: 'index.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Index extends Reactive implements OnInit {
    public readonly translateService = inject(TranslateService);
    public readonly store = inject(Store);
    public readonly document = inject(DOCUMENT);
    public readonly router = inject(Router);
    private readonly domSanitizer = inject(DomSanitizer);
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly clientDetailsSocialShareService = inject(
        ClientDetailsSocialShareService,
    );
    private readonly clientDetailsJsonLdService = inject(
        ClientDetailsJsonLdService,
    );
    private readonly ngxLogger = inject(NGXLogger);

    public readonly item$ = this.store
        .select(ClientState.item)
        .pipe(filter(is.not_null<Client.IClient>));
    public readonly title$ = this.item$.pipe(map((item) => item.name));
    public readonly logo$ = this.item$.pipe(
        map((item) => item.logo?.url ?? '/assets/logo.png'),
    );
    public readonly googleMapBaseAddress = 'https://www.google.com/maps/place/';

    public readonly address$: Observable<RIAddress | undefined> = this.item$.pipe(
        map((item) => item.addresses),
        map((addresses) => addresses[0]),
    );

    public getAddressString(address: RIAddress): string {
        if (!address) return '';
        const country = address?.country ? `${this.translateService.instant('country.' + address.country)}` : '';
        const city = address?.city ? `${address.city}` : '';
        const streetAddressLineOne = address?.streetAddressLineOne ? `${address.streetAddressLineOne}` : '';
        const streetAddressLineTwo = address?.streetAddressLineTwo ? `${address.streetAddressLineTwo}` : '';
        const zipCode = address?.zipCode ? `${address.zipCode}` : '';

        const addressList = [streetAddressLineOne, streetAddressLineTwo, city, country, zipCode];

        return addressList.filter(Boolean).join(', ');
    }

    public readonly tabTypes = TabTypes;

    public selectedTab = TabTypes.services;

    public readonly tabMenuItems = [
        {labelTranslateKey: 'tabMenu.service.label', value: TabTypes.services},
        {labelTranslateKey: 'tabMenu.details.label', value: TabTypes.details},
    ];

    public getLink(address: RIAddress): string | SafeUrl {
        if (address?.customLink) {
            return this.domSanitizer.bypassSecurityTrustUrl(address.customLink);
        }
        return `${this.googleMapBaseAddress}${this.getAddressString(address)}`;
    }

    public ngOnInit() {
        this.clientDetailsSocialShareService.init();
        this.clientDetailsJsonLdService.init();
        this.store
            .select(ServiceState.items)
            .pipe(this.takeUntil(), delay(100))
            .subscribe(() => {
                this.document.dispatchEvent(
                    new Event('AngularReady', {
                        bubbles: true,
                        cancelable: false,
                    }),
                );
            });
    }

    @Dispatch()
    public cartAddService($event: IService) {
        return new CartActions.AddService($event);
    }

    public selectedService($event: IService) {
        this.ngxLogger.debug('ClientDetailsPage.selectedService', $event);
        const {serviceSessionId} = this.cartAddService($event);
        this.router.navigate(['order', 'form', serviceSessionId], {
            relativeTo: this.activatedRoute,
        });
    }
}
