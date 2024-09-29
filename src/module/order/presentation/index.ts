import {Routes} from '@angular/router';
import {StepEnum} from '@order/enum/step.enum';
import {orderDetailsResolver} from "@order/presentation/resolver/order.details.resolver";

export const routers = [
    {
        path: 'form',
        children: [
            {
                path: '',
                data: {
                    step: StepEnum.service,
                },
                loadComponent: () => import('./page/form'),
            },
            {
                path: ':serviceSessionId',
                data: {
                    step: StepEnum.timeSlotAndSpecialist,
                },
                loadComponent: () => import('./page/form'),
            },
        ],
    },
    {
        path: 'cart',
        loadComponent: () => import('./page/cart'),
    },
    {
        path: ':id',
        resolve: {
            item: orderDetailsResolver,
        },
        loadComponent: () => import('./page/details'),
    },
] as Routes;

export default routers;
