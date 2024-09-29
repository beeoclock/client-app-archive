import {inject} from '@angular/core';
import {ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot,} from '@angular/router';
import {catchError, EMPTY} from 'rxjs';
import {IService} from '@service/domain';
import {ItemServiceApiAdapter} from '@service/adapter/external/api/item.service.api.adapter';

export const serviceDetailsResolver: ResolveFn<IService> = (
  route: ActivatedRouteSnapshot,
  _state: RouterStateSnapshot,
) => {
  const itemServiceApiAdapter = inject(ItemServiceApiAdapter);
  const id = route.paramMap.get('id');

  if (!id) {
    return EMPTY;
  }

  return itemServiceApiAdapter.execute$(id).pipe(catchError(() => EMPTY));
};
