import {inject, Injectable} from '@angular/core';
import {Action, NgxsOnInit, Selector, State, StateContext} from '@ngxs/store';
import * as Specialist from '@specialist/domain';
import {SpecialistActions} from '@module/specialist/state/member/specialist.actions';
import {CLIENT_ID} from '@src/token';
import {ListSpecialistApiAdapter} from '@specialist/adapter/external/api/list.specialist.api.adapter';

export type ISpecialistState = {
  items: Specialist.ISpecialist[];
};

@State<ISpecialistState>({
  name: 'specialist',
  defaults: {
    items: [],
  },
})
@Injectable()
export class SpecialistState implements NgxsOnInit {
  private readonly CLIENT_ID$ = inject(CLIENT_ID);
  private readonly listSpecialistApiAdapter = inject(ListSpecialistApiAdapter);

  public ngxsOnInit(ctx: StateContext<any>) {
    this.CLIENT_ID$.subscribe((clientId) => {
      if (!clientId) {
          ctx.patchState({items: []});
        return;
      }
      ctx.dispatch(new SpecialistActions.GetList());
    });
  }

  @Action(SpecialistActions.GetItem)
  public async getItem(
    ctx: StateContext<ISpecialistState>,
    action: SpecialistActions.GetItem,
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }

  @Action(SpecialistActions.GetList)
  public async getList(ctx: StateContext<ISpecialistState>): Promise<void> {
      const {items} = await this.listSpecialistApiAdapter.executeAsync();
      ctx.patchState({items});
  }

  // Selectors

  @Selector()
  public static items(state: ISpecialistState) {
    return state.items;
  }
}
