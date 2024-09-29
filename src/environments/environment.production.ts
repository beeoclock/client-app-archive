export const environment = {
    firebase: {
        options: {
        },
        emulator: {
            all: false,
            authorization: false,
        },
    },
    production: true,
    emulator: false,
    apiUrls: {
        client: 'https://api.beeoclock.com/client',
        identity: 'https://api.beeoclock.com/identity',
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
        notFound: 'https://beeoclock.biz/',
    },
    url: {
        self: 'https://beeoclock.com',
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
