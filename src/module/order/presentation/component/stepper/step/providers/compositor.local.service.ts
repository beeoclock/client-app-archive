import {inject, Injectable} from '@angular/core';
import {DateTime} from 'luxon';
import {SelectSnapshot} from '@ngxs-labs/select-snapshot';
import {ClientState} from '@client/state/client/client.state';
import {IClient} from '@client/domain';
import {environment} from '@environments/environment';
import {Reactive} from '@utility/cdk/reactive';
import {NGXLogger} from 'ngx-logger';
import {CartServiceDetails, CartState} from '@order/state/cart/cart.state';
import {ActivatedRoute} from '@angular/router';
import {SpecialistState} from '@specialist/state/member/specialist.state';
import {ISpecialist} from '@specialist/domain';
import {CartActions} from '@order/state/cart/cart.actions';
import {Store} from '@ngxs/store';
import {SlotsLocalService} from '@order/presentation/component/stepper/step/providers/slots.local.service';
import {BusySlotsLocalService} from '@order/presentation/component/stepper/step/providers/busy-slots.local.service';
import {SpecialistModeEnum} from '@order/enum/specialist-mode.enum';
import {filter, map, Observable, tap} from 'rxjs';
import {is} from '@utility/checker';

@Injectable()
export class CompositorLocalService extends Reactive {
    private readonly slotsLocalService = inject(SlotsLocalService);
    private readonly busySlotsLocalService = inject(BusySlotsLocalService);
    private readonly ngxLogger = inject(NGXLogger);
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly store = inject(Store);

    @SelectSnapshot(ClientState.item)
    public client!: IClient;

    @SelectSnapshot(CartState.getServices)
    public services!: CartServiceDetails[];

    @SelectSnapshot(SpecialistState.items)
    public specialists!: ISpecialist[];

    public cartService: CartServiceDetails | undefined;

    public readonly cartService$: Observable<CartServiceDetails | undefined> =
        this.store.select(CartState.getServices).pipe(
            this.takeUntil(),
            filter(is.array_not_empty<CartServiceDetails[]>),
            tap((services) => {
                this.busySlotsLocalService.deleteTemporaryBusySlotForSpecialistId();
                services.forEach((service) => {
                    let specialistId = service.specialistId;
                    if (!specialistId) {
                        specialistId = service.slot.specialistIds[0];
                    }
                    if (!specialistId) {
                        return;
                    }
                    this.busySlotsLocalService.putToTemporaryBusySlotForSpecialistId(specialistId, {
                        start: service.slot.start,
                        end: service.slot.end,
                    })
                });
            }),
            map(() => {
                const {serviceSessionId} = this.activatedRoute.snapshot.params;
                return this.services.find(
                    ({serviceSessionId: _id}) => _id === serviceSessionId,
                );
            }),
            filter(is.not_null_or_undefined),
        );

    public get isAnybodyMode() {
        if (!this.cartService) {
            this.ngxLogger.error('isAnybodyMode: cartService is not exist');
            return false;
        }
        if (this.cartService.specialistMode === SpecialistModeEnum.any) {
            return true;
        }
        return !this.cartService.specialistId;
    }

    private readonly cartServiceSubscription = this.cartService$.subscribe(
        (cartService) => {
            this.cartService = structuredClone(cartService);
        },
    );

    public get slotIsSelected() {
        return (this.cartService?.slot?.start?.length ?? 0) > 0;
    }

    public get slotIsNotSelected() {
        return !this.slotIsSelected;
    }

    public clearSlot() {
        if (!this.cartService) {
            this.ngxLogger.error('clearSlot: cartService is not exist');
            return;
        }
        this.cartService.slot = {
            start: '',
            end: '',
            specialistIds: [],
        };
        this.store.dispatch(
            new CartActions.UpdateSlot({
                serviceSessionId: this.cartService.serviceSessionId,
                slot: this.cartService.slot,
            }),
        );
    }

    public selectSlot(slot: {
        start: DateTime;
        end: DateTime;
        specialistIds: string[];
    }) {
        this.ngxLogger.debug('CompositorLocalService:selectSlot', slot);
        if (!this.cartService) {
            this.ngxLogger.error('selectSlot: cartService is not exist');
            return;
        }
        this.cartService.slot = {
            ...slot,
            start: slot.start.toJSDate().toISOString(),
            end: slot.end.toJSDate().toISOString(),
        };
        this.store.dispatch(
            new CartActions.UpdateSlot({
                serviceSessionId: this.cartService.serviceSessionId,
                slot: this.cartService.slot,
            }),
        );
    }

    public selectSpecialist(specialistId: string | null) {
        if (!this.cartService) {
            this.ngxLogger.error('selectSlot: cartService is not exist');
            return;
        }
        this.cartService.specialistId = specialistId;
        this.cartService.specialistMode = specialistId
            ? SpecialistModeEnum.specific
            : SpecialistModeEnum.any;
        this.store.dispatch(
            new CartActions.UpdateSpecialist({
                serviceSessionId: this.cartService.serviceSessionId,
                specialistId: this.cartService.specialistId,
                specialistMode: this.cartService.specialistMode,
            }),
        );
    }

    public async buildDayItemList(startDateTime: DateTime) {
        startDateTime = this.fixStartDateTime(startDateTime);

        let endDateTime = startDateTime.plus(
            environment.config.slots.selectDay.step,
        );

        endDateTime = this.fixEndDateTime(endDateTime);

        // Init busy slots (do request to server to get data)
        await this.busySlotsLocalService.initBusySlots(startDateTime, endDateTime);

        // Init day item list (build day item list based on date range)
        this.slotsLocalService.initDayItemList(startDateTime, endDateTime);

        // Build slots per day (build slots per day based on day item list)
        await this.buildSlotsPerDay();
    }

    private fixStartDateTime(startDateTime: DateTime): DateTime {
        const {earliestBooking} = this.client?.bookingSettings ?? {};

        if (!earliestBooking) {
            return startDateTime;
        }

        const earliestBookingDateTime = DateTime.now().plus({
            seconds: earliestBooking,
        });
        if (earliestBookingDateTime && earliestBookingDateTime > startDateTime) {
            startDateTime = earliestBookingDateTime;
        }
        return startDateTime;
    }

    private fixEndDateTime(endDateTime: DateTime): DateTime {
        const {latestBooking} = this.client?.bookingSettings ?? {};
        if (!latestBooking) {
            return endDateTime;
        }
        const latestBookingDateTime = DateTime.now().plus({
            seconds: latestBooking,
        });
        if (latestBookingDateTime && latestBookingDateTime < endDateTime) {
            endDateTime = latestBookingDateTime;
        }
        return endDateTime;
    }

    private async buildSlotsPerDay() {
        const {businessSettings, schedules, bookingSettings} = this.client;

        const cartService = this.cartService;
        if (!cartService) {
            this.ngxLogger.error('buildSlotsPerDay: service is not exist');
            return;
        }

        const {durationInSeconds, service} = cartService;

        const busySlotsMapBySpecialistId =
            this.busySlotsLocalService.getBusySlotsMapBySpecialistId();

        const temporaryBusySlotsMapBySpecialistId =
            this.busySlotsLocalService.getTemporaryBusySlotsMapBySpecialistId();

        const mergedBusySlotsMapBySpecialistId = {
            ...busySlotsMapBySpecialistId,
        };

        Object.keys(temporaryBusySlotsMapBySpecialistId).forEach((specialistId) => {
            if (!mergedBusySlotsMapBySpecialistId[specialistId]) {
                mergedBusySlotsMapBySpecialistId[specialistId] = [];
            }
            mergedBusySlotsMapBySpecialistId[specialistId].push(
                ...temporaryBusySlotsMapBySpecialistId[specialistId],
            );
        });

        const specialistsAssignedToService = this.specialists.filter(
            ({assignments}) => {
                if (!assignments?.service) {
                    return false;
                }
                if (assignments.service.full) {
                    return true;
                }
                return assignments.service.include.some(
                    ({service: {_id}}) => _id === service._id,
                );
            },
        );

        this.ngxLogger.debug('CompositorLocalService:buildSlotsPerDay', {
            businessSettings,
            schedules,
            bookingSettings,
            durationInSeconds,
            busySlotsMapBySpecialistId,
            specialistsAssignedToService,
        });

        this.slotsLocalService
            .setTimeZone(businessSettings.timeZone)
            .setSchedules(schedules)
            .setServiceDurationInSeconds(durationInSeconds)
            .setBusyMapBySpecialistId(mergedBusySlotsMapBySpecialistId)
            .setSpecialistIdsForSelectedService(
                specialistsAssignedToService.map(({_id}) => _id),
            )
            .setSlotBuildingStrategy(
                bookingSettings.slotSettings.slotBuildingStrategy,
            )
            .setSlotIntervalInSeconds(
                bookingSettings.slotSettings.slotIntervalInSeconds,
            );

        if (this.slotsLocalService.necessaryValueIsExist()) {
            if (this.slotsLocalService.initializing.isOff) {
                this.slotsLocalService.initializing.switchOn();
                this.slotsLocalService.initSlots().then();
            }
        } else {
            this.ngxLogger.error('buildSlotsPerDay: necessary value is not exist');
        }
    }
}
