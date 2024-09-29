export const environment = {
    firebase: {
        options: {
        },
        emulator: {
            all: false,
            authorization: false,
        },
    },
    production: false,
    emulator: false,
    apiUrls: {
        client: 'https://api.dev.beeoclock.com/client',
        identity: 'https://api.dev.beeoclock.com/identity',
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
