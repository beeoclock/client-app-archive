import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    HostBinding,
    inject,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import {AsyncPipe, CurrencyPipe, NgForOf, NgIf} from '@angular/common';
import {ItemOnListV2Component} from '@specialist/presentation/component/item/item-on-list.v2.component';
import {LoaderComponent} from '@utility/presentation/component/loader/loader.component';
import {NoteComponent} from '@order/presentation/component/form/note/note.component';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {Store} from '@ngxs/store';
import {OrderFormRepository} from '@order/repository/order.form.repository';
import {AttendantStepComponent} from '@order/presentation/component/stepper/step/sub/attendant.step.component';
import {ChangeLanguageComponent} from '@utility/presentation/component/change-language/change-language.component';
import {OverlappingLayerComponent} from '@order/presentation/component/overlapping-layer/overlapping-layer.component';
import {HeaderComponent} from '@utility/presentation/component/header/default/header.component';
import {CartServiceDetails, CartState} from '@order/state/cart/cart.state';
import {SpecialistState} from '@specialist/state/member/specialist.state';
import {SelectSnapshot} from '@ngxs-labs/select-snapshot';
import {ISpecialist} from '@specialist/domain';
import {firstValueFrom, lastValueFrom} from 'rxjs';
import {DynamicDatePipe} from '@utility/presentation/directives/dynamic-date.pipe';
import {AttendantForm, AttendeesFormArray,} from '@order/presentation/form/attendant.form';
import {CartActions} from '@order/state/cart/cart.actions';
import {CurrencyCodeEnum} from '@utility/domain/enum';
import {ContainerFormComponent} from '@order/presentation/component/form/service/container.form.component';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {NGXLogger} from "ngx-logger";
import AgreementsComponent from "@order/presentation/component/form/agreements/agreements.component";
import {PaymentActions} from "@module/payment/state/payment/payment.actions";
import {IPaymentDto} from "@module/payment/domain/interface/dto/i.payment.dto";
import {PaymentMethodEnum} from "@module/payment/domain/enum/payment.method.enum";
import {PaymentProviderTypeEnum} from "@module/payment/domain/enum/payment.provider-type.enum";
import {PaymentStatusEnum} from "@module/payment/domain/enum/payment.status.enum";
import {randomCustomer} from "@customer/domain/interface/i.customer";
import ObjectID from "bson-objectid";

@Component({
    selector: 'cart-details-component',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        AsyncPipe,
        ItemOnListV2Component,
        LoaderComponent,
        NgIf,
        NoteComponent,
        TranslateModule,
        AttendantStepComponent,
        ChangeLanguageComponent,
        OverlappingLayerComponent,
        NgForOf,
        HeaderComponent,
        DynamicDatePipe,
        CurrencyPipe,
        ContainerFormComponent,
        RouterLink,
        AgreementsComponent,
    ],
    template: `
        <div
            class="flex w-full flex-col gap-2"
            *ngIf="cartServices$ | async as cartServices"
        >
            <div class="px-3 text-lg font-bold sm:px-0">
                {{ 'keyword.capitalize.servicesOrdered' | translate }}
            </div>
            <div
                *ngFor="let cartService of cartServices"
                class="w-full divide-y divide-slate-600 border-slate-600 bg-slate-800 sm:rounded-2xl sm:border"
            >
                <div class="flex gap-2 p-3">
                    <item-on-list-v2 [service]="cartService.service"/>
                    <button
                        (click)="removeService(cartService)"
                        type="button"
                        class="flex min-h-14 min-w-14 items-center justify-center rounded-lg text-lg text-red-500 transition-all duration-200 hover:bg-red-500 hover:text-slate-800 active:scale-95"
                    >
                        <i class="bi bi-trash3-fill"></i>
                    </button>
                </div>
                <div class="flex justify-start gap-2 p-3">
                    <div
                        *ngIf="cartService.slot.start.length"
                        class="inline-flex items-center gap-2 rounded-md bg-gray-50 px-2 py-1 text-sm font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
                    >
                        <i class="bi bi-clock"></i>
                        {{ cartService.slot.start | dynamicDate }}
                    </div>
                    <div
                        class="inline-flex items-center gap-2 rounded-md bg-gray-50 px-2 py-1 text-sm font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
                    >
                        <i class="bi bi-person"></i>
                        {{ getSpecialist(cartService)?.firstName }}
                    </div>
                </div>
            </div>
            <a
                *ngIf="(cartServices$ | async)?.length"
                [routerLink]="['../', 'form']"
                class="flex w-full items-center justify-end rounded-lg px-3 py-1 text-sm font-bold text-yellow-400 transition-all duration-200 hover:underline active:scale-95 sm:px-0"
            >
                <i class="bi bi-plus-lg text-lg"></i>&nbsp;
                {{ 'keyword.capitalize.add-next-service' | translate }}
            </a>

            <a
                *ngIf="!(cartServices$ | async)?.length"
                [routerLink]="['../', 'form']"
                class="flex w-full items-center justify-start rounded-lg px-3 py-1 text-sm font-bold text-yellow-400 transition-all duration-200 hover:underline active:scale-95 sm:px-0"
            >
                <i class="bi bi-plus-lg text-lg"></i>&nbsp;
                {{ 'keyword.capitalize.add-service' | translate }}
            </a>
        </div>

        <div class="flex flex-col gap-4 px-4 py-8 pb-32 sm:px-0 w-full">
            <attendant-step [attendeesControl]="attendeesControl"/>
            <event-note [control]="form.controls.note"/>
            <agreements-component [control]="form.controls.agreements"/>
            <div
                class="flex flex-col gap-2 rounded-lg bg-slate-800 p-4"
                *ngIf="((totalAmount$ | async) ?? -1) >= 0"
            >
                <div class="flex justify-between">
                    <div>{{ 'keyword.capitalize.totalAmount' | translate }}:</div>
                    <div class="font-bold">
                        {{ (totalAmount$ | async) | currency: currency: 'symbol-narrow': '1.0-2' }}
                    </div>
                </div>
            </div>
            <button
                (click)="save()"
                [disabled]="(cartIsEmpty$ | async) || form.pending"
                type="button"
                class="flex items-center justify-center rounded-lg border-2 border-slate-600 bg-yellow-400 py-4 font-bold uppercase text-slate-600 shadow transition-all duration-100 active:scale-95"
            >
                <ng-template [ngIf]="!form.pending">
                    {{ 'keyword.capitalize.makeAnAppointment' | translate }}
                </ng-template>
                <ng-template [ngIf]="form.pending">
                    <utility-loader [inProgressLabel]="true"/>
                </ng-template>
            </button>
        </div>
    `,
})
export class CartDetailsComponent implements OnInit {

    private readonly store = inject(Store);
    private readonly orderFormRepository = inject(OrderFormRepository);
    private readonly ngxLogger = inject(NGXLogger);
    private readonly router = inject(Router);
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly translateService = inject(TranslateService);
    private readonly changeDetectorRef = inject(ChangeDetectorRef);

    @ViewChild(AttendantStepComponent, {static: true})
    public attendantStepComponent!: AttendantStepComponent;

    @HostBinding()
    public class = 'flex mx-auto w-full max-w-md flex-col items-center justify-start sm:px-4';

    @SelectSnapshot(SpecialistState.items)
    public specialists!: ISpecialist[];

    @SelectSnapshot(CartState.getCustomerInfo)
    public customerInfo!: {
        firstName: string | undefined;
        phone: string | undefined;
        email: string | undefined;
    };

    @SelectSnapshot(CartState.note)
    public note!: string;

    @SelectSnapshot(CartState.getCurrency)
    public currency!: CurrencyCodeEnum;

    public readonly cartServices$ = this.store.select(CartState.getServices);

    public readonly totalAmount$ = this.store.select(CartState.getTotalAmount);

    public readonly cartIsEmpty$ = this.store.select(CartState.isEmpty);

    public readonly attendeesControl = new AttendeesFormArray([
        new AttendantForm(),
    ]);

    public getSpecialist(service: CartServiceDetails) {
        const {specialistId} = service;
        if (!specialistId) {
            const {slot} = service;
            if (!slot) {
                return;
            }
            const {
                specialistIds: {0: specialistId},
            } = slot;
            return this.specialists.find(
                (specialist) => specialist._id === specialistId,
            );
        }
        return this.specialists.find(
            (specialist) => specialist._id === specialistId,
        );
    }

    public removeService({serviceSessionId}: CartServiceDetails) {
        const question = this.translateService.instant('cart.confirm.removeService.question');
        if (confirm(question)) {
            this.store.dispatch(new CartActions.RemoveService(serviceSessionId));
        }
    }

    public ngOnInit() {
        // Attendant
        this.attendeesControl.controls[0].patchValue(this.customerInfo, {
            emitEvent: false,
            onlySelf: true,
        });
        this.attendeesControl.controls[0].valueChanges.subscribe((attendant) => {
            this.store.dispatch(
                new CartActions.SetCustomerInfo(
                    attendant.firstName,
                    attendant.phone,
                    attendant.email
                )
            );
        });
        // Comment
        this.form.controls.note.patchValue(this.note, {
            emitEvent: false,
            onlySelf: true,
        });
        this.form.controls.note.valueChanges.subscribe((note) => {
            this.store.dispatch(
                new CartActions.SetNote(note)
            );
        });
    }

    public get form() {
        return this.orderFormRepository.form;
    }

    public async save() {

        try {
            const isAttendeesGood = this.attendantStepComponent.checkAttendees();

            if (!isAttendeesGood) {
                this.ngxLogger.error('save: attendees are not good');
                return;
            }

            const cartServices = await firstValueFrom(this.cartServices$);

            if (!cartServices?.length) {
                this.ngxLogger.error('save: cartService is empty');
                return;
            }

            this.fillFormWithCartServices(cartServices);

            const orderId = await this.orderFormRepository.save();
            const payer = Object.assign(randomCustomer(), this.attendeesControl.getRawValue()[0]);
            const amount = await firstValueFrom(this.totalAmount$);
            const paymentDto: IPaymentDto = {
                object: 'PaymentDto',
                _id: ObjectID().toHexString(),
                providerPaymentRef: '',
                orderId,
                amount,
                currency: this.currency,
                method: PaymentMethodEnum.CASH,
                providerType: PaymentProviderTypeEnum.onSite,
                status: PaymentStatusEnum.pending,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                payer,
            };
            const action$ = this.dispatchPaymentCreateAction$(paymentDto);
            await lastValueFrom(action$);

            this.changeDetectorRef.detectChanges();

            if (orderId) {
                this.router.navigate(['../', orderId], {
                    relativeTo: this.activatedRoute,
                });
            }
        } catch (e) {
            this.ngxLogger.error('save: error', e);
        }

    }

    private dispatchPaymentCreateAction$(payment: IPaymentDto) {
        const action = new PaymentActions.CreateItem({
            item: payment,
        });
        return this.store.dispatch(action);
    }

    private fillFormWithCartServices(cartServices: CartServiceDetails[]) {

        this.form.controls.services.clear();

        for (const cartService of cartServices) {

            let wasSelectedAnybody = false;
            let specialistId = cartService.specialistId;

            // If specialistId is not set, then we need to get the first specialistId from the slot
            if (!specialistId) {

                wasSelectedAnybody = true;
                specialistId = cartService.slot.specialistIds[0];

            }

            this.orderFormRepository.pushNewServiceWithData(
                cartService.service,
                {
                    specialistId,
                    wasSelectedAnybody,
                    slot: {
                        start: cartService.slot.start,
                        end: cartService.slot.end,
                    },
                    attendees: this.attendeesControl.getRawValue(),
                }
            );

        }

    }

}
