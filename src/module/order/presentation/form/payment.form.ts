import {CurrencyCodeEnum} from "@utility/domain/enum";
import {FormControl} from "@angular/forms";
import {PaymentMethodEnum} from "@module/payment/domain/enum/payment.method.enum";
import {PaymentProviderTypeEnum} from "@module/payment/domain/enum/payment.provider-type.enum";
import {PaymentStatusEnum} from "@module/payment/domain/enum/payment.status.enum";
import {BaseEntityForm} from "@order/utility/base.form";
import {CustomerForm} from "@order/presentation/form/customer.form";
import {CustomerTypeEnum} from "@customer/domain/enum/customer-type.enum";
import {IPaymentDto} from "@module/payment/domain/interface/dto/i.payment.dto";

export interface IPaymentForm {
    providerPaymentRef: FormControl<string | null>;
    orderId: FormControl<string>;
    payer: CustomerForm;
    amount: FormControl<number>;
    currency: FormControl<CurrencyCodeEnum>;
    method: FormControl<PaymentMethodEnum>;
    providerType: FormControl<PaymentProviderTypeEnum>;
    status: FormControl<PaymentStatusEnum>;
    paymentDate: FormControl<string>;
}

export class PaymentForm extends BaseEntityForm<'PaymentDto', IPaymentForm> {

    constructor() {
        super('PaymentDto', {
            providerPaymentRef: new FormControl(),
            orderId: new FormControl(),
            payer: CustomerForm.create({
                customerType: CustomerTypeEnum.new,
            }),
            amount: new FormControl<number>(0, {
                nonNullable: true,
            }),
            currency: new FormControl(),
            method: new FormControl(PaymentMethodEnum.CASH, {
                nonNullable: true,
            }),
            providerType: new FormControl(PaymentProviderTypeEnum.onSite, {
                nonNullable: true,
            }),
            status: new FormControl(PaymentStatusEnum.succeeded, {
                nonNullable: true,
            }),
            paymentDate: new FormControl(new Date().toISOString(), {
                nonNullable: true,
            }),
        });
    }

    public static create(initValue: Partial<IPaymentDto> = {}): PaymentForm {

        const form = new PaymentForm();

        form.patchValue(initValue);

        return form;

    }

}
