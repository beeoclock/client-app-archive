import {AbstractControl, FormControl, Validators} from '@angular/forms';
import {ActiveEnum} from "@utility/domain/enum";
import {noWhitespaceValidator} from "@utility/validation/whitespace";
import {CustomerTypeEnum} from "@customer/domain/enum/customer-type.enum";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {BaseEntityForm} from "@order/utility/base.form";
import {atLeastOneFieldMustBeFilledValidator} from "@utility/validation";
import {ICustomer} from "@customer/domain/interface/i.customer";

export const enum CustomerFormFieldsEnum {

    firstName = 'firstName',
    lastName = 'lastName',
    note = 'note',
    email = 'email',
    phone = 'phone',
    customerType = 'customerType',

    active = 'active',
}

export interface ICustomerForm {

    [CustomerFormFieldsEnum.firstName]: FormControl<string | null>;
    [CustomerFormFieldsEnum.lastName]: FormControl<string | null>;
    [CustomerFormFieldsEnum.note]: FormControl<string | null>;
    [CustomerFormFieldsEnum.email]: FormControl<string | null>;
    [CustomerFormFieldsEnum.phone]: FormControl<string | null>;

    [CustomerFormFieldsEnum.active]: FormControl<ActiveEnum>;
    [CustomerFormFieldsEnum.customerType]: FormControl<CustomerTypeEnum>;

}

export class CustomerForm extends BaseEntityForm<'CustomerDto', ICustomerForm> {

    private readonly destroy$ = new Subject<void>();

    public readonly regularCaseValidator = atLeastOneFieldMustBeFilledValidator([
        CustomerFormFieldsEnum.email,
        CustomerFormFieldsEnum.phone
    ]);

    public readonly unregisteredCaseValidator = atLeastOneFieldMustBeFilledValidator([
        CustomerFormFieldsEnum.firstName,
        CustomerFormFieldsEnum.lastName
    ]);

    constructor() {
        super('CustomerDto', {

            [CustomerFormFieldsEnum.firstName]: new FormControl(),
            [CustomerFormFieldsEnum.lastName]: new FormControl(),
            [CustomerFormFieldsEnum.email]: new FormControl(),
            [CustomerFormFieldsEnum.phone]: new FormControl(),

            [CustomerFormFieldsEnum.note]: new FormControl(),

            [CustomerFormFieldsEnum.active]: new FormControl(ActiveEnum.YES, {
                nonNullable: true,
            }),

            [CustomerFormFieldsEnum.customerType]: new FormControl(CustomerTypeEnum.new, {
                nonNullable: true,
            }),
        });
        this.initValidation();
        this.initHandlers();
    }

    public isNew(): boolean {
        return this.controls.customerType.value === CustomerTypeEnum.new;
    }

    public isNotNew(): boolean {
        return !this.isNew();
    }

    public isEmpty(): boolean {
        return Object.values(this.controls).every((control: AbstractControl) => {
            return control.value === null;
        });
    }

    public isNotEmpty(): boolean {
        return !this.isEmpty();
    }

    public initValidation(): void {

        this.controls.email.setValidators([Validators.email, noWhitespaceValidator()]);
        this.controls.phone.setValidators([noWhitespaceValidator()]);

        this.detectValidators(this.getRawValue().customerType);

    }

    public addValidatorsForRegularCase(): void {
        this.addValidators(this.regularCaseValidator);
    }

    public removeValidatorsForRegularCase(): void {
        this.removeValidators(this.regularCaseValidator);
    }

    public addValidatorsForUnregisteredCase(): void {
        this.addValidators(this.unregisteredCaseValidator);
    }

    public removeValidatorsForUnregisteredCase(): void {
        this.removeValidators(this.unregisteredCaseValidator);
    }

    public static create(initValue: Partial<ICustomer> = {}): CustomerForm {

        const form = new CustomerForm();

        form.patchValue(initValue);

        return form;

    }

    public initHandlers(): void {

        this.controls.customerType.valueChanges.pipe(
            takeUntil(this.destroy$)
        ).subscribe((customerType) => {

            this.detectValidators(customerType);

        });

    }

    public destroyHandlers(): void {

        this.destroy$.next();
        this.destroy$.complete();

    }

    private detectValidators(customerType: CustomerTypeEnum): void {
        this.removeValidatorsForRegularCase();
        this.removeValidatorsForUnregisteredCase();

        switch (customerType) {
            case CustomerTypeEnum.new:
            case CustomerTypeEnum.regular:
                this.addValidatorsForRegularCase();
                break;

            case CustomerTypeEnum.unregistered:
                this.addValidatorsForUnregisteredCase();
                break;
        }
    }
}
