import {HttpHandlerFn, HttpInterceptorFn, HttpRequest,} from '@angular/common/http';

/**
 * Set Authorization header to every request that has at config header.authorization = true
 *
 * @param request
 * @param next
 */
export const AccessTokenInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  // const {header} = Endpoint.endpointMap[request.method as RequestMethodEnum].get(request.url) ?? {};
  //
  // if (header) {
  //
  //   const {authorization} = header;
  //
  //   if (authorization) {
  //
  //     const store = inject(Store);
  //
  //     return store.select(IdentityState.token).pipe(exhaustMap((tokenState) => {
  //       const headers = request.headers.set('Authorization', `Bearer ${tokenState?.token}`);
  //       return next(request.clone({
  //         headers
  //       }));
  //     }))
  //
  //   }
  //
  // }

  return next(request);
};
