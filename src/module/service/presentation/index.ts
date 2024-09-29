import {Routes} from '@angular/router';
import {serviceDetailsResolver} from '@service/resolver/service.details.resolver';

export const routers = [
  {
    path: 'details',
    children: [
      {
        path: ':id',
        resolve: {
          item: serviceDetailsResolver,
        },
        loadComponent: () => import('./page/details'),
      },
    ],
  },
] as Routes;
