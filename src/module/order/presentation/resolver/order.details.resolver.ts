import {inject} from '@angular/core';
import {ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot,} from '@angular/router';
import {Store} from '@ngxs/store';
import {catchError, EMPTY, filter, switchMap} from 'rxjs';
import {IAppState} from '@utility/state/app/app.state';
import {is} from '@utility/checker';
import {OrderActions} from '@order/state/order/order.actions';
import {OrderState} from '@order/state/order/order.state';
import {PublicOrderDto} from '@order/domain/dto/public-order.dto';

export const orderDetailsResolver: ResolveFn<PublicOrderDto> = (
  route: ActivatedRouteSnapshot,
  _state: RouterStateSnapshot,
) => {
  const store = inject(Store);
  const id = route.paramMap.get('id');

  if (!id) {
    return EMPTY;
  }

    const {app}: { app: IAppState } = store.snapshot();

  if (app?.pageLoading) {
    return EMPTY;
  }

  return store.dispatch(new OrderActions.GetItem(id)).pipe(
    switchMap(() =>
      store.select(OrderState.item).pipe(filter(is.not_null<PublicOrderDto>)),
    ),
    catchError((error) => EMPTY),
  );
};
