import {inject, Injectable} from '@angular/core';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {CurrencyCodeEnum} from '@utility/domain/enum';
import {IService} from '@module/service';
import {CartActions} from '@order/state/cart/cart.actions';
import {SpecialistModeEnum} from '@order/enum/specialist-mode.enum';
import {CLIENT_ID} from "@src/token";
import {BehaviorSubject} from 'rxjs';
import {NGXLogger} from "ngx-logger";

export interface CartServiceDetails {
    serviceSessionId: string;
    service: IService;
    durationInSeconds: number;
    slot: {
        start: string;
        end: string;
        specialistIds: string[];
    };
    specialistId: string | null;
    specialistMode: SpecialistModeEnum;
}

export interface CustomerInfo {
    firstName: string | undefined;
    phone: string | undefined;
    email: string | undefined;
}

export interface CartStateModel {
    [key: string]: {
        customerInfo: CustomerInfo | null;
        rememberCustomerInfo: boolean;
        services: CartServiceDetails[];
        note: string;
        totalAmount: number;
        currency: CurrencyCodeEnum;
    }
}

@State<CartStateModel>({
    name: 'cart',
    defaults: {},
})
@Injectable()
export class CartState {

    @Selector()
    static getServices(state: CartStateModel) {
        const {value: clientId} = CartState.CLIENT_ID$;
        const store = state[clientId];
        if (!store) {
            return null;
        }
        return store.services;
    }

    @Selector()
    static getCustomerInfo(state: CartStateModel) {
        const {value: clientId} = CartState.CLIENT_ID$;
        const store = state[clientId];
        if (!store) {
            return null;
        }
        return store.customerInfo;
    }

    @Selector()
    static note(state: CartStateModel) {
        const {value: clientId} = CartState.CLIENT_ID$;
        const store = state[clientId];
        if (!store) {
            return null;
        }
        return store.note;
    }

    @Selector()
    static getTotalAmount(state: CartStateModel) {
        const {value: clientId} = CartState.CLIENT_ID$;
        const store = state[clientId];
        if (!store) {
            return 0;
        }
        return store.totalAmount;
    }

    @Selector()
    static getCurrency(state: CartStateModel) {
        const {value: clientId} = CartState.CLIENT_ID$;
        const store = state[clientId];
        if (!store) {
            return null;
        }
        return store.currency;
    }

    @Selector()
    static isNotEmpty(state: CartStateModel) {
        const {value: clientId} = CartState.CLIENT_ID$;
        const store = state[clientId];
        if (!store) {
            return false;
        }
        const notEmptyServices = store.services.filter((service) => service.slot.start.length);
        return notEmptyServices.length > 0;
    }

    @Selector()
    static isEmpty(state: CartStateModel) {
        const {value: clientId} = CartState.CLIENT_ID$;
        const store = state[clientId];
        if (!store) {
            return true;
        }
        const notEmptyServices = store.services.filter((service) => service.slot.start.length);
        return notEmptyServices.length === 0;
    }

    public static CLIENT_ID$: BehaviorSubject<string>;

    private readonly CLIENT_ID$ = inject(CLIENT_ID);
    private readonly ngxLogger = inject(NGXLogger);

    constructor() {
        CartState.CLIENT_ID$ = this.CLIENT_ID$;
    }

    @Action(CartActions.AddService)
    addServiceToCart(
        ctx: StateContext<CartStateModel>,
        action: CartActions.AddService,
    ) {
        const clientId = this.CLIENT_ID$.value;
        const {[clientId]: peerClientCustomerData} = ctx.getState();
        const services = [
            ...(peerClientCustomerData?.services ?? []),
            {
                serviceSessionId: action.serviceSessionId,
                service: action.service,
                slot: {start: '', end: '', specialistIds: []},
                durationInSeconds: this.getDurationFromLastService(action.service),
                specialistMode: SpecialistModeEnum.any,
                specialistId: null,
            },
        ];
        const totalAmount = this.calculateTotalAmount(services);

        ctx.patchState({
            [clientId]: {
                ...(peerClientCustomerData ?? {}),
                services,
                totalAmount,
                currency: action.service.durationVersions[0].prices[0].currency, // Assuming all services use the same currency
            },
        });

    }

    @Action(CartActions.UpdateSlot)
    updateSlot(
        ctx: StateContext<CartStateModel>,
        {payload}: CartActions.UpdateSlot,
    ) {
        const clientId = this.CLIENT_ID$.value;
        const {[clientId]: peerClientCustomerData} = ctx.getState();

        if (!peerClientCustomerData) {
            return;
        }

        const services = peerClientCustomerData.services.map((service, index) => {
            if (service.serviceSessionId === payload.serviceSessionId) {
                if (index > 0) {
                    // If the service is not the first one, set the specialistId to the previous service's specialistId
                    const previousService = peerClientCustomerData.services[index - 1];

                    if (
                        previousService.specialistId &&
                        payload.slot.specialistIds.includes(previousService.specialistId)
                    ) {
                        return {
                            ...service,
                            slot: payload.slot,
                            specialistId: previousService.specialistId,
                        };
                    }
                }
                return {
                    ...service,
                    slot: payload.slot,
                };
            }
            return service;
        });

        ctx.patchState({
            [clientId]: {
                ...peerClientCustomerData,
                services,
            },
        });
    }

    @Action(CartActions.UpdateSpecialist)
    updateSpecialist(
        ctx: StateContext<CartStateModel>,
        {payload}: CartActions.UpdateSpecialist,
    ) {
        const clientId = this.CLIENT_ID$.value;
        const {[clientId]: peerClientCustomerData} = ctx.getState();

        if (!peerClientCustomerData) {
            return;
        }

        const services = peerClientCustomerData.services.map((service) => {
            if (service.serviceSessionId === payload.serviceSessionId) {
                return {
                    ...service,
                    specialistMode: payload.specialistMode,
                    specialistId: payload.specialistId,
                };
            }
            return service;
        });

        ctx.patchState({
            [clientId]: {
                ...peerClientCustomerData,
                services,
            },
        });
    }

    @Action(CartActions.RemoveService)
    removeServiceFromCart(
        ctx: StateContext<CartStateModel>,
        action: CartActions.RemoveService,
    ) {
        const clientId = this.CLIENT_ID$.value;
        const {[clientId]: peerClientCustomerData} = ctx.getState();

        if (!peerClientCustomerData) {
            return;
        }

        const services = peerClientCustomerData.services.filter(
            (service) => service.serviceSessionId !== action.serviceSessionId,
        );
        const totalAmount = this.calculateTotalAmount(services);

        ctx.patchState({
            [clientId]: {
                ...peerClientCustomerData,
                services,
                totalAmount,
            },
        });
    }

    @Action(CartActions.SetCustomerInfo)
    setCustomerInfo(
        ctx: StateContext<CartStateModel>,
        action: CartActions.SetCustomerInfo,
    ) {
        const clientId = this.CLIENT_ID$.value;
        const {[clientId]: peerClientCustomerData} = ctx.getState();

        ctx.patchState({
            [clientId]: {
                ...(peerClientCustomerData ?? {
                    services: [],
                    note: '',
                    totalAmount: 0,
                }),
                rememberCustomerInfo: true,
                customerInfo: {
                    firstName: action.firstName,
                    phone: action.phone,
                    email: action.email,
                },
            },
        });
    }

    @Action(CartActions.Clear)
    clear(
        ctx: StateContext<CartStateModel>,
    ) {

        const clientId = this.CLIENT_ID$.value;

        const {[clientId]: peerClientCustomerData} = ctx.getState();

        this.ngxLogger.info('clear: form', peerClientCustomerData);

        ctx.patchState({
            [clientId]: {
                ...(peerClientCustomerData ?? {}),
                services: [],
                note: '',
                totalAmount: 0,
            }
        });

        if (!peerClientCustomerData.rememberCustomerInfo) {

            ctx.patchState({
                [clientId]: {
                    ...(peerClientCustomerData ?? {}),
                    services: [],
                    note: '',
                    totalAmount: 0,
                    customerInfo: null,
                }
            });

        }

    }

    @Action(CartActions.SetNote)
    setNote(
        ctx: StateContext<CartStateModel>,
        action: CartActions.SetNote,
    ) {
        const clientId = this.CLIENT_ID$.value;
        const {[clientId]: peerClientCustomerData} = ctx.getState();
        ctx.patchState({
            [clientId]: {
                ...(peerClientCustomerData ?? {
                    services: [],
                    note: '',
                    totalAmount: 0,
                }),
                note: action.comment,
            }
        });
    }

    private getDurationFromLastService(service: IService): number {
        const {durationVersions} = service;

        if (!durationVersions || !durationVersions.length) {
            return 0;
        }

        const {durationInSeconds, breakInSeconds} =
            durationVersions[durationVersions.length - 1];

        return (durationInSeconds ?? 0) + (breakInSeconds ?? 0);
    }

    private calculateTotalAmount(services: CartServiceDetails[]): number {
        return (
            services.reduce((total, serviceDetails) => {
                const servicePrice =
                    serviceDetails.service.durationVersions[0].prices[0].price; // Assuming the first price is the relevant one
                // Convert to integer for accurate addition
                const servicePriceInt = Math.round(servicePrice * 100);
                return total + servicePriceInt;
            }, 0) / 100
        ); // Convert back to decimal
    }
}
