import {Routes, UrlSegment} from '@angular/router';
import {clientIdResolver} from '@utility/presentation/resolver/client-id.resolver';
import {environment} from '@environments/environment';
import {isSupportedLanguageCodeEnum} from '@utility/domain/enum';
import {clientDetailsResolver} from '@client/resolver/client.details.resolver';

export function languageMatcher(url: UrlSegment[]) {
    return url.length > 0 && isSupportedLanguageCodeEnum(url[0].path as string)
        ? {
            consumed: [url[0]],
            posParams: {
                language: url[0],
            },
        }
        : null;
}

export const routes: Routes = [
    {
        path: 'redirect',
        loadComponent: () => import('@utility/presentation/pages/redirect'),
    },
    {
        path: 'inactive',
        loadComponent: () => import('@utility/presentation/pages/inactive'),
    },
    {
        matcher: languageMatcher,
        children: [
            {
                path: ':clientId',
                resolve: {
                    clientId: clientIdResolver,
                },
                children: [
                    {
                        path: '',
                        loadChildren: () => import('@client/index'),
                    },
                    {
                        path: 'order',
                        resolve: {
                            client: clientDetailsResolver,
                        },
                        loadChildren: () => import('@order/index'),
                    },
                    {
                        path: 'service',
                        loadChildren: () => import('@service/index'),
                    },
                    {
                        path: ':memberId',
                        loadChildren: () => import('@module/specialist/index'),
                    },
                ],
            },
        ],
    },
    {
        path: ':clientId',
        resolve: {
            clientId: clientIdResolver,
        },
        children: [
            {
                path: '',
                loadChildren: () => import('@client/index'),
            },
            {
                path: 'order',
                resolve: {
                    client: clientDetailsResolver,
                },
                loadChildren: () => import('@order/index'),
            },
            {
                path: 'service',
                loadChildren: () => import('@service/index'),
            },
            {
                path: ':memberId',
                loadChildren: () => import('@module/specialist/index'),
            },
        ],
    },
    {
        path: '**',
        redirectTo: '/redirect?to=' + environment.redirect.notFound,
    },
];
