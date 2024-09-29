import {inject} from '@angular/core';
import {ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot,} from '@angular/router';
import {Store} from '@ngxs/store';
import {catchError, EMPTY} from 'rxjs';
import {IAppState} from '@utility/state/app/app.state';
import {SpecialistActions} from '@module/specialist/state/member/specialist.actions';
import {ISpecialist} from '@module/specialist/domain';

export const specialistDetailsResolver: ResolveFn<ISpecialist | void> = (
  route: ActivatedRouteSnapshot,
  _state: RouterStateSnapshot,
) => {
  const store = inject(Store); // NGXS
  const id = route.paramMap.get('id');

  if (!id) {
    return EMPTY;
  }

    const {app}: { app: IAppState } = store.snapshot();

  if (app?.pageLoading) {
    return EMPTY;
  }

  return store
    .dispatch(new SpecialistActions.GetItem(id))
    .pipe(catchError((error) => EMPTY));
};
