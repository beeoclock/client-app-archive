import {Routes} from '@angular/router';
import {clientDetailsResolver} from '@client/resolver/client.details.resolver';

export const routers = [
  {
    path: '',
    resolve: {
      item: clientDetailsResolver,
    },
    loadComponent: () => import('./page/details'),
  },
] as Routes;
