import {inject, Injectable} from '@angular/core';
import {OrderForm} from '@order/presentation/form/order.form';
import {NGXLogger} from 'ngx-logger';
import {IService} from '@module/service';
import {LanguageCodeEnum} from '@utility/domain/enum';
import {DateTime} from 'luxon';
import {AttendantDto} from "@order/domain/dto/create-public-order.dto";
import {CartActions} from "@order/state/cart/cart.actions";
import {CreateOrderApiAdapter} from "@order/adapter/external/api/create.order.api.adapter";
import {Store} from "@ngxs/store";

@Injectable({
    providedIn: 'root',
})
export class OrderFormRepository {

    private readonly ngxLogger = inject(NGXLogger);
    private readonly createOrderApiAdapter = inject(CreateOrderApiAdapter);
    private readonly store = inject(Store);

    public readonly form = new OrderForm();

    public clear(): void {
        this.form.reset();
        this.form.generateNewId();
    }

    public async save(): Promise<string> {

        this.form.submit();

        if (this.form.invalid) {

            this.ngxLogger.error('save: invalid form', this.form);
            throw new Error('Form is invalid');

        }

        try {

            this.form.markAsPending();

            const {note, ...rawFormValue} = this.form.getRawValue();

            this.ngxLogger.info('save: form', rawFormValue);

            const response = await this.createOrderApiAdapter.executeAsync({
                ...rawFormValue,
                services: rawFormValue.services.map((service) => {
                    return {
                        ...service,
                        customerNote: (note ?? '')
                    }
                })
            });

            this.ngxLogger.info('save: response', response);

            // Clear order and cart
            this.clear();
            this.store.dispatch(new CartActions.Clear());

            this.form.enable();
            this.form.updateValueAndValidity();

            return rawFormValue._id;

        } catch (e) {

            // TODO add message that something went wrong
            this.ngxLogger.error('save: error', e);

        }

        this.form.enable();
        this.form.markAllAsTouched();
        this.form.updateValueAndValidity();

        throw new Error('Something went wrong');

    }

    public pushNewServiceWithData(service: IService, data: {
        specialistId: string;
        wasSelectedAnybody: boolean;
        slot: {
            start: string;
            end: string;
        };
        attendees: AttendantDto[];
    }) {
        const languageCodes: LanguageCodeEnum[] = service.languageVersions.map(
            (languageVersion) => {
                return languageVersion.language;
            },
        );

        const {specialistId, slot, attendees, wasSelectedAnybody} = data;

        const index = this.form.controls.services.pushNewOne({
            object: 'CreatePublicOrderServiceDto',
            serviceSnapshot: {
                _id: service._id,
                durationVersions: service.durationVersions.map((durationVersion) => {
                    return {
                        breakInSeconds: durationVersion.breakInSeconds,
                        durationInSeconds: durationVersion.durationInSeconds,
                        prices: durationVersion.prices.map((price) => {
                            return {
                                price: price.price,
                                currency: price.currency,
                            };
                        }),
                    };
                }),
            },
            orderAppointmentDetails: {
                object: 'CreatePublicOrderAppointmentDetailsDto',
                start: slot.start,
                end: slot.end,
                languageCodes: languageCodes,
                attachments: [],
                attendees,
                specialists: [{
                    _id: specialistId,
                    wasSelectedAnybody,
                }],
                locations: [],
                timeZone: DateTime.local().zoneName,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
        });

        this.ngxLogger.info(
            'Added service',
            this.form.controls.services.getRawValue(),
        );

        return !!this.form.controls.services.at(index);
    }

}
