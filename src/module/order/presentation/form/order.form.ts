import {
    AttachmentDto,
    CreatePublicOrderServiceDto,
    DurationVersionsDto,
    LocationDto,
    OrderProductDto,
    PriceDto,
} from '@order/domain/dto/create-public-order.dto';
import ObjectID from 'bson-objectid';
import {AttendantForm, AttendeesFormArray,} from '@order/presentation/form/attendant.form';
import {BeeoclockFormArray} from '@utility/custom/beeoclock.form-array';
import {FormControl, Validators, ɵFormGroupValue} from '@angular/forms';
import {BeeoclockFormGroup} from '@utility/custom/beeoclock.form-group';
import {LanguageCodeEnum} from '@src/module/utility/domain/enum';

export interface IPriceForm {
    price: FormControl<number>;
    currency: FormControl<string>;
}

export class PriceForm extends BeeoclockFormGroup<IPriceForm> {
    constructor(initialValue: Partial<PriceDto> = {}) {
        super({
            price: new FormControl(0, {
                nonNullable: true,
            }),
            currency: new FormControl('USD', {
                nonNullable: true,
            }),
        });
        this.patchValue(initialValue);
    }
}

export class PriceFormArray extends BeeoclockFormArray<PriceForm> {
    public pushNewOne(initialValue: Partial<PriceDto> = {}): void {
        this.push(new PriceForm(initialValue));
    }
}

export interface IDurationVersionsForm {
    breakInSeconds: FormControl<number>;
    durationInSeconds: FormControl<number>;
    prices: PriceFormArray;
}

export class DurationVersionsForm extends BeeoclockFormGroup<IDurationVersionsForm> {
    constructor(initialValue: Partial<DurationVersionsDto> = {}) {
        super({
            breakInSeconds: new FormControl(0, {
                nonNullable: true,
            }),
            durationInSeconds: new FormControl(0, {
                nonNullable: true,
            }),
            prices: new PriceFormArray([new PriceForm()]),
        });
        this.patchValue(initialValue);
    }

    public override patchValue(
        value: ɵFormGroupValue<IDurationVersionsForm>,
        options?: {
            onlySelf?: boolean;
            emitEvent?: boolean;
        },
    ) {
        super.patchValue(value, options);
        // Detect prices
        const prices = value.prices;
        if (prices) {
            this.controls.prices.clear();
            prices.forEach((price) => {
                this.controls.prices.pushNewOne(price);
            });
        }
    }
}

export class DurationVersionsFormArray extends BeeoclockFormArray<DurationVersionsForm> {
    public pushNewOne(initialValue: Partial<DurationVersionsDto> = {}): void {
        this.push(new DurationVersionsForm(initialValue));
    }
}

export interface IServiceSnapshotForm {
    _id: FormControl<string>;
    durationVersions: DurationVersionsFormArray;
}

export class ServiceSnapshotForm extends BeeoclockFormGroup<IServiceSnapshotForm> {
    constructor() {
        super({
            _id: new FormControl(ObjectID().toHexString(), {
                nonNullable: true,
            }),
            durationVersions: new DurationVersionsFormArray([
                new DurationVersionsForm(),
            ]),
        });
    }
}

export interface ICreatePublicOrderAppointmentDetailsForm {
    object: FormControl<'CreatePublicOrderAppointmentDetailsDto'>;
    start: FormControl<string>;
    end: FormControl<string>;
    languageCodes: FormControl<LanguageCodeEnum[]>;
    attachments: FormControl<AttachmentDto[]>;
    // attachments: BeeoclockFormGroup<{
    //   object: FormControl<"AttachmentDto">;
    //   title: FormControl<string>;
    //   mimeType: FormControl<string>;
    //   fileUri: FormControl<string>;
    //   active: FormControl<"ActiveEnum">;
    // }>[];
    locations: FormControl<LocationDto[]>;
    // locations: BeeoclockFormGroup<{
    //   object: FormControl<"LocationDto">;
    //   types: FormControl<"ONLINE_CUSTOM"[]>;
    //   password: FormControl<string>;
    //   address: FormControl<string>;
    // }>[];
    attendees: AttendeesFormArray;
    specialists: FormControl<{
        _id: string;
        wasSelectedAnybody: boolean;
    }[]>;
    timeZone: FormControl<string>;
    createdAt: FormControl<string>;
    updatedAt: FormControl<string>;
}

export class CreatePublicOrderAppointmentDetailsForm extends BeeoclockFormGroup<ICreatePublicOrderAppointmentDetailsForm> {
    constructor() {
        super({
            object: new FormControl('CreatePublicOrderAppointmentDetailsDto', {
                nonNullable: true,
            }),
            start: new FormControl('', {
                nonNullable: true,
            }),
            end: new FormControl('', {
                nonNullable: true,
            }),
            languageCodes: new FormControl([], {
                nonNullable: true,
            }),
            attachments: new FormControl([], {
                nonNullable: true,
            }),
            locations: new FormControl([], {
                nonNullable: true,
            }),
            attendees: new AttendeesFormArray([new AttendantForm()]),
            specialists: new FormControl([], {
                nonNullable: true,
            }),
            timeZone: new FormControl('', {
                nonNullable: true,
            }),
            createdAt: new FormControl('', {
                nonNullable: true,
            }),
            updatedAt: new FormControl('', {
                nonNullable: true,
            }),
        });
    }

    public override patchValue(
        value: ɵFormGroupValue<ICreatePublicOrderAppointmentDetailsForm>,
        options?: {
            onlySelf?: boolean;
            emitEvent?: boolean;
        },
    ) {
        super.patchValue(value, options);
        // Detect attendees
        const attendees = value.attendees;
        if (attendees && attendees.length) {
            this.controls.attendees.clear();
            attendees.forEach((attendee) => {
                this.controls.attendees.pushNewOne(attendee);
            });
        }
    }
}

export interface ICreatePublicOrderServiceForm {
    object: FormControl<'CreatePublicOrderServiceDto'>;
    customerNote: FormControl<string>;
    serviceSnapshot: ServiceSnapshotForm;
    orderAppointmentDetails: CreatePublicOrderAppointmentDetailsForm;
}

export class CreatePublicOrderServiceForm extends BeeoclockFormGroup<ICreatePublicOrderServiceForm> {
    constructor(initialValue: Partial<CreatePublicOrderServiceDto> = {}) {
        super({
            object: new FormControl('CreatePublicOrderServiceDto', {
                nonNullable: true,
            }),
            customerNote: new FormControl('', {
                nonNullable: true,
            }),
            serviceSnapshot: new ServiceSnapshotForm(),
            orderAppointmentDetails: new CreatePublicOrderAppointmentDetailsForm(),
        });
        this.patchValue(initialValue);
    }

    public override patchValue(
        value: ɵFormGroupValue<ICreatePublicOrderServiceForm>,
        options?: {
            onlySelf?: boolean;
            emitEvent?: boolean;
        },
    ) {
        super.patchValue(value, options);
        // Detect serviceSnapshot
        const serviceSnapshot = value.serviceSnapshot;
        if (serviceSnapshot) {
            this.controls.serviceSnapshot.patchValue(serviceSnapshot);
        }
        // Detect orderAppointmentDetails
        const orderAppointmentDetails = value.orderAppointmentDetails;
        if (orderAppointmentDetails) {
            this.controls.orderAppointmentDetails.patchValue(orderAppointmentDetails);
        }
    }
}

export class CreatePublicOrderServiceFormArray extends BeeoclockFormArray<CreatePublicOrderServiceForm> {
    public pushNewOne(
        initialValue: Partial<CreatePublicOrderServiceDto> = {},
    ): number {
        this.push(new CreatePublicOrderServiceForm(initialValue));
        return this.controls.length - 1;
    }
}

export interface IOrderForm {
    object: FormControl<'CreatePublicOrderDto'>;
    _id: FormControl<string>;
    products: FormControl<OrderProductDto[]>;
    services: CreatePublicOrderServiceFormArray;
    note: FormControl<string>;
    agreements: FormControl<boolean>;
}

export class OrderForm extends BeeoclockFormGroup<IOrderForm> {
    constructor() {
        super({
            object: new FormControl('CreatePublicOrderDto', {
                nonNullable: true,
            }),
            _id: new FormControl(ObjectID().toHexString(), {
                nonNullable: true,
            }),
            products: new FormControl([], {
                nonNullable: true,
            }),
            services: new CreatePublicOrderServiceFormArray([]),
            note: new FormControl('', {
                nonNullable: true,
            }),
            agreements: new FormControl(false, {
                nonNullable: true,
                validators: [Validators.requiredTrue]
            }),
        });
    }

    public generateNewId(): void {
        this.controls._id.patchValue(ObjectID().toHexString());
    }
}
