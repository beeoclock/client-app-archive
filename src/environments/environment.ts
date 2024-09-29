// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    emulator: false,
    apiUrls: {
        client: 'api.client',
        identity: 'api.identity',
    },
    endpoint: {
        config: {
            replace: false,
            loading: false,
            defaultErrorHandler: true,
        },
    },
    config: {
        language: 'en',
        modal: {
            prefix: 'beeoclock_modal_',
        },
        slots: {
            selectDay: {
                step: {
                    days: 5,
                },
            },
        },
    },
    firebase: {
        options: {
        },
        emulator: {
            all: false,
            authorization: false,
            functions: false,
        },
    },
    redirect: {
        notFound: 'https://dev.beeoclock.biz/',
    },
    url: {
        self: 'https://dev.beeoclock.com',
    },
    socialNetwork: {
        link: {
            facebook: 'https://www.facebook.com/beeoclock.biz',
            instagram: 'https://www.instagram.com/beeoclock.biz',
            x: 'https://www.x.com/bee_o_clock',
        },
        username: {
            facebook: 'beeoclock.biz',
            instagram: 'beeoclock.biz',
            x: 'bee_o_clock',
        },
    },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
