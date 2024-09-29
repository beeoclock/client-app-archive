import {inject, Injectable} from '@angular/core';
import {Action, NgxsOnInit, Selector, State, StateContext} from '@ngxs/store';
import {IService} from '@service/domain';
import {ServiceActions} from '@service/state/service/service.actions';
import {ListServiceApiAdapter} from '@service/adapter/external/api/list.service.api.adapter';
import {CLIENT_ID} from '@src/token';

export type IServiceState = {
  items: IService[];
};

@State<IServiceState>({
  name: 'service',
  defaults: {
    items: [],
  },
})
@Injectable()
export class ServiceState implements NgxsOnInit {
  private readonly listServiceApiAdapter = inject(ListServiceApiAdapter);
  private readonly CLIENT_ID$ = inject(CLIENT_ID);

  ngxsOnInit(ctx: StateContext<any>) {
    this.CLIENT_ID$.subscribe((clientId) => {
      if (!clientId) {
          ctx.patchState({items: []});
        return;
      }
      ctx.dispatch(new ServiceActions.GetList());
    });
  }

  @Action(ServiceActions.GetList)
  public async getList(ctx: StateContext<IServiceState>): Promise<void> {
      const {items} = await this.listServiceApiAdapter.executeAsync();
      ctx.patchState({items});
  }

  // Selectors

  @Selector()
  public static items(state: IServiceState) {
    return state.items;
  }
}
