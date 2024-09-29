import {inject, Injectable} from '@angular/core';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {OrderActions} from '@module/order/state/order/order.actions';
import {ItemOrderApiAdapter} from '@order/adapter/external/api/item.order.api.adapter';
import {PublicOrderDto} from '@order/domain/dto/public-order.dto';
import {CreatePublicOrderDto} from '@order/domain/dto/create-public-order.dto';
import {CreateOrderApiAdapter} from "@order/adapter/external/api/create.order.api.adapter";

export type IOrderEvent = {
    item: PublicOrderDto | null;
    draft: CreatePublicOrderDto | null;
};

@State<IOrderEvent>({
    name: 'order',
    defaults: {
        item: null,
        draft: null,
    },
})
@Injectable()
export class OrderState {
    // Selectors

    @Selector()
    public static item(state: IOrderEvent) {
        return state.item;
    }

    private readonly itemOrderApiAdapter = inject(ItemOrderApiAdapter);
    private readonly createOrderApiAdapter = inject(CreateOrderApiAdapter);

    @Action(OrderActions.GetItem)
    public async getItem(
        ctx: StateContext<IOrderEvent>,
        {payload}: OrderActions.GetItem,
    ) {
        const item = await this.itemOrderApiAdapter.executeAsync(payload);
        ctx.patchState({
            item: {
                ...item,
                services: item.services.sort((a, b) => {
                    return new Date(a.orderAppointmentDetails.start).getTime() - new Date(b.orderAppointmentDetails.start).getTime();
                })
            }
        });
    }

    @Action(OrderActions.SetDraft)
    public async setDraftActionHandler(
        ctx: StateContext<IOrderEvent>,
        {payload}: OrderActions.SetDraft,
    ) {
        ctx.patchState({
            draft: payload,
        });
    }

    @Action(OrderActions.SaveOrder)
    public async saveOrderActionHandler(
        ctx: StateContext<IOrderEvent>,
        {payload}: OrderActions.SaveOrder,
    ) {
        await this.createOrderApiAdapter.executeAsync(payload);
    }
}
