import {inject, Injectable} from '@angular/core';
import {IClient} from '@client/domain';
import {ClientActions} from '@client/state/client/client.actions';
import {Action, NgxsOnInit, Selector, State, StateContext} from '@ngxs/store';
import {ItemClientApiAdapter} from '@client/adapter/api/item.client.api.adapter';
import {CLIENT_ID} from '@src/token';
import {Router} from '@angular/router';

export interface IClientState {
  items: IClient[];
  item: IClient | null;
}

@State<IClientState>({
  name: 'client',
  defaults: {
    items: [],
    item: null,
  },
})
@Injectable()
export class ClientState implements NgxsOnInit {
  private readonly router = inject(Router);
  private readonly itemClientApiAdapter = inject(ItemClientApiAdapter);
  private readonly CLIENT_ID$ = inject(CLIENT_ID);

  ngxsOnInit(ctx: StateContext<any>) {
    this.CLIENT_ID$.subscribe((clientId) => {
      if (!clientId) {
          ctx.patchState({item: null});
        return;
      }
      ctx.dispatch(new ClientActions.GetItem(clientId));
    });
  }

  @Action(ClientActions.GetItem)
  async getItem(
    ctx: StateContext<IClientState>,
    {payload}: ClientActions.GetItem,
  ) {
    const item = await this.itemClientApiAdapter
      .executeAsync(payload)
      .catch(() => {
        this.router.navigate(['/', 'inactive']);
        return null;
      });
      ctx.patchState({item});
  }

  // Selectors

  @Selector()
  public static item(state: IClientState) {
    return state.item;
  }

  @Selector()
  public static isAutoBookEvent(state: IClientState) {
    return state.item?.bookingSettings.autoBookEvent ?? false;
  }

  @Selector()
  public static availableLanguages(state: IClientState) {
    return state.item?.businessSettings?.availableLanguages ?? [];
  }

  @Selector()
  public static bookingSettings(state: IClientState) {
    return state.item?.bookingSettings;
  }

  @Selector()
  public static timeZone(state: IClientState) {
    return state.item?.businessSettings?.timeZone;
  }
}
