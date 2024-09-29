import {ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot,} from '@angular/router';
import {inject} from '@angular/core';
import {EMPTY} from 'rxjs';
import {CLIENT_ID} from '@src/token';

export const clientIdResolver: ResolveFn<string | undefined> = (
  route: ActivatedRouteSnapshot,
  _state: RouterStateSnapshot,
) => {
  const CLIENT_ID$ = inject(CLIENT_ID);
    const {clientId} = route.params;

  if (!clientId) {
    return EMPTY;
  }

  CLIENT_ID$.next(clientId);
  return clientId;
};
