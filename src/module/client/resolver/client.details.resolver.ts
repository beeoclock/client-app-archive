import {inject} from '@angular/core';
import {ActivatedRouteSnapshot, ResolveFn, Router, RouterStateSnapshot,} from '@angular/router';
import {EMPTY, filter, mergeMap, of} from 'rxjs';
import * as Client from '@client/domain';
import {Store} from '@ngxs/store';
import {ClientState} from '@client/state/client/client.state';
import {is} from '@utility/checker';

export const clientDetailsResolver: ResolveFn<Client.IClient> = (
  route: ActivatedRouteSnapshot,
  _state: RouterStateSnapshot,
) => {
  const router = inject(Router);
  const store = inject(Store);
  const clientId = route.paramMap.get('clientId');

  if (!clientId) {
    return EMPTY;
  }

  return store.select(ClientState.item).pipe(
    filter(is.not_null<Client.IClient>),
    mergeMap((result) => {
      if (result.published) {
        return of(result);
      }
      router.navigate(['/', 'inactive']);
      return EMPTY;
    }),
  );
};
