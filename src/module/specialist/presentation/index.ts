import {Routes} from '@angular/router';
import {specialistDetailsResolver} from '@module/specialist/resolver/specialist.details.resolver';

export const routers = [
  {
    path: 'details',
    children: [
      {
        path: ':id',
        resolve: {
          item: specialistDetailsResolver,
        },
        loadComponent: () => import('./page/details'),
      },
    ],
  },
] as Routes;
