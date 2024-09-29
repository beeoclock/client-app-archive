import {inject, Injectable} from '@angular/core';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {ItemPaymentApiAdapter} from '@module/payment/adapter/external/api/item.payment.api.adapter';
import {PaymentActions} from '@module/payment/state/payment/payment.actions';
import {CreatePaymentApiAdapter} from "@module/payment/adapter/external/api/create.payment.api.adapter";
import {PaymentForm} from "@order/presentation/form/payment.form";
import {IPaymentDto} from "@module/payment/domain/interface/dto/i.payment.dto";

export type IPaymentState = {
    item: IPaymentDto | null;
};

@State<IPaymentState>({
    name: 'payment',
    defaults: {
        item: null,
    },
})
@Injectable()
export class PaymentState {
    private readonly itemPaymentApiAdapter = inject(ItemPaymentApiAdapter);
    private readonly createPaymentApiAdapter = inject(CreatePaymentApiAdapter);

    @Action(PaymentActions.GetItem)
    public async getItem(
        ctx: StateContext<IPaymentState>,
        {payload}: PaymentActions.GetItem,
    ): Promise<void> {
        const item = await this.itemPaymentApiAdapter.executeAsync(payload);
        ctx.patchState({item});
    }

    @Action(PaymentActions.CreateItem)
    public async createItem(
        ctx: StateContext<IPaymentState>,
        action: PaymentActions.CreateItem,
    ): Promise<void> {
        const paymentForm = PaymentForm.create(action.payload.item);
        const paymentDto = paymentForm.getRawValue();
        const item = await this.createPaymentApiAdapter.executeAsync(paymentDto);
    }

    // Selectors

    @Selector()
    public static item(state: IPaymentState) {
        return state.item;
    }
}
