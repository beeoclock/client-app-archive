import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    inject,
    Input,
    OnChanges,
    SimpleChanges,
    ViewEncapsulation
} from "@angular/core";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {PublicOrderDto} from "@order/domain/dto/public-order.dto";
import {ClientState} from "@client/state/client/client.state";
import * as Client from "@client/domain";
import {SelectSnapshot} from "@ngxs-labs/select-snapshot";
import {RIAddress} from "@client/domain/interface/i.address";
import {AsyncPipe, CurrencyPipe, NgForOf, NgIf} from "@angular/common";
import {DynamicDatePipe} from "@utility/presentation/directives/dynamic-date.pipe";
import {ItemOnListV2Component} from "@specialist/presentation/component/item/item-on-list.v2.component";
import {IService} from "@src/module/service";
import {NoteComponent} from "@order/presentation/component/form/note/note.component";

@Component({
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'order-details-component',
    imports: [
        TranslateModule,
        NgForOf,
        AsyncPipe,
        DynamicDatePipe,
        ItemOnListV2Component,
        NgIf,
        CurrencyPipe,
        NoteComponent
    ],
    template: `


        <div
            class="flex w-full flex-col gap-2"
        >
            <div class="px-3 text-lg font-bold sm:px-0">
                {{ 'keyword.capitalize.servicesOrdered' | translate }}
            </div>
            <div
                *ngFor="let service of item.services"
                class="w-full divide-y divide-slate-600 border-slate-600 bg-slate-800 sm:rounded-2xl sm:border"
            >
                <div class="flex gap-2 p-3">
                    <item-on-list-v2 [service]="toModel(service.serviceSnapshot)"/>
                </div>
                <div class="flex justify-start gap-2 p-3">
                    <div
                        *ngIf="service.orderAppointmentDetails.start.length"
                        class="inline-flex items-center gap-2 rounded-md bg-gray-50 px-2 py-1 text-sm font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
                    >
                        <i class="bi bi-clock"></i>
                        {{ service.orderAppointmentDetails.start | dynamicDate }}
                    </div>
                    <div
                        class="inline-flex items-center gap-2 rounded-md bg-gray-50 px-2 py-1 text-sm font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
                    >
                        <i class="bi bi-person"></i>
                        {{ service.orderAppointmentDetails.specialists[0].firstName }}
                    </div>
                </div>
            </div>
        </div>
        <div class="w-full dark:bg-slate-800 sm:rounded-2xl">
            <table class="w-full table-auto border-collapse">
                <tbody class="divide-y divide-slate-600">
                <tr>
                    <td class="p-3 text-slate-500">
                        {{ 'keyword.capitalize.businessName' | translate }}:
                    </td>
                    <td class="p-3 text-slate-300">
                        {{ client.name }}
                    </td>
                </tr>
                <tr>
                    <td class="p-3 text-slate-500">
                        {{ 'keyword.capitalize.address' | translate }}:
                    </td>
                    <td class="p-3 text-slate-300">
                        <a
                            [href]="googleMapBaseAddress + getAddressString(client.addresses[0])"
                            class="underline"
                            target="_blank">
                            {{ getAddressString(client.addresses[0]) }}
                        </a>
                    </td>
                </tr>
                <tr>
                    <td class="p-3 text-slate-500">
                        {{ 'keyword.capitalize.comment' | translate }}:
                    </td>
                    <td class="p-3 text-slate-300">
                        {{ item.services[0].customerNote ?? '-' }}
                    </td>
                </tr>
                </tbody>
            </table>
        </div>


        <div
            class="flex flex-col gap-2 rounded-lg bg-slate-800 p-4"
            *ngIf="totalAmount"
        >
            <div class="flex justify-between">
                <div>{{ 'keyword.capitalize.totalAmount' | translate }}:</div>
                <div class="font-bold">
                    {{ totalAmount | currency: currency: 'symbol-narrow': '1.0-2' }}
                </div>
            </div>
            <!--                <div class="flex justify-between">-->
            <!--                    <div>{{ 'keyword.capitalize.paymentMethod' | translate }}:</div>-->
            <!--                    <div class="font-bold">-->
            <!--                        {{ 'paymentMethod.cash' | translate }}-->
            <!--                    </div>-->
            <!--                </div>-->
        </div>

    `
})
export class OrderDetailsComponent implements OnChanges {

    @Input({required: true})
    item!: PublicOrderDto;

    @SelectSnapshot(ClientState.item)
    public readonly client!: Client.IClient;

    @HostBinding()
    public class = 'flex flex-col gap-4'

    public totalAmount = 0;
    public currency: string | undefined;

    private readonly translateService = inject(TranslateService);

    public readonly googleMapBaseAddress = 'https://www.google.com/maps/place/';

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

    public toModel(service: any): IService {
        return service as IService;
    }

    public ngOnChanges(changes: SimpleChanges & { item: PublicOrderDto }) {
        if (changes.item) {
            this.totalAmount = this.item.services.reduce((acc, service) => acc + service.serviceSnapshot.durationVersions[0].prices[0].price, 0);
            this.currency = this.item.services[0].serviceSnapshot.durationVersions[0].prices[0].currency;
        }
    }

}
