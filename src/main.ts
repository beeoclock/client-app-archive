import {provideRouter, withInMemoryScrolling} from '@angular/router';
import {enableProdMode, importProvidersFrom, LOCALE_ID} from '@angular/core';
import polish from '@angular/common/locales/pl';
import ukraine from '@angular/common/locales/uk';
import denmark from '@angular/common/locales/da';
import {HttpClient, provideHttpClient, withInterceptors,} from '@angular/common/http';
import {bootstrapApplication} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {routes} from './routers';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {environment} from '@environments/environment';
import {initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {connectAuthEmulator, getAuth, provideAuth} from '@angular/fire/auth';
import {browserLocalPersistence} from '@firebase/auth';
import {registerLocaleData} from '@angular/common';
import {AppService} from '@src/app.service';
import {NgxsModule} from '@ngxs/store';
import {AppState} from '@utility/state/app/app.state';
import {NgxsReduxDevtoolsPluginModule} from '@ngxs/devtools-plugin';
import {Utility} from '@utility/index';
import {initRuntimeEnvironment} from '@src/runtime.environment';
import {LoggerModule, NgxLoggerLevel} from 'ngx-logger';
import {isSupportedLanguageCodeEnum} from '@utility/domain/enum';
import {SpecialistState} from '@specialist/state/member/specialist.state';
import {ServiceState} from '@service/state/service/service.state';
import {ClientState} from '@client/state/client/client.state';
import {tokens} from '@src/token';
import {ScullyLibModule} from '@scullyio/ng-lib';
import {getAnalytics, provideAnalytics} from '@angular/fire/analytics';
import {PaymentState} from '@module/payment/state/payment/payment.state';
import {OrderState} from '@order/state/order/order.state';
import {NgxsDispatchPluginModule} from '@ngxs-labs/dispatch-decorator';
import {NgxsSelectSnapshotModule} from '@ngxs-labs/select-snapshot';
import {CartState} from '@order/state/cart/cart.state';

registerLocaleData(polish);
registerLocaleData(ukraine);
registerLocaleData(denmark);

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

if (environment.production) {
    enableProdMode();
}

initRuntimeEnvironment();

bootstrapApplication(AppComponent, {
    providers: [
        ...tokens,
        provideRouter(
            routes,
            withInMemoryScrolling({
                scrollPositionRestoration: 'enabled',
                anchorScrolling: 'enabled',
            }),
        ),

        {
            provide: LOCALE_ID,
            deps: [AppService],
            useFactory: (appService: AppService) => {
                const userLang = (() => {
                    // Get language from url
                    const url = new URL(window.location.href);
                    const userLangByUrl = url.pathname.split('/')[1];

                    if (isSupportedLanguageCodeEnum(userLangByUrl)) {
                        return userLangByUrl;
                    }

                    const userLangByLocalStorage: string | null =
                        localStorage.getItem('language');

                    if (userLangByLocalStorage) {
                        return userLangByLocalStorage;
                    }

                    const userLangByNavigator: string | undefined =
                        navigator?.language?.split?.('-')?.[0];

                    if (isSupportedLanguageCodeEnum(userLangByNavigator)) {
                        return userLangByNavigator;
                    }

                    return environment.config.language;
                })();
                appService.translateService.use(userLang);
                return appService.translateService.currentLang;
            },
        },

        provideHttpClient(
            withInterceptors([
                // Utility.Interceptors.Approval, // TODO find way how to handle firebase network!
                // Utility.Interceptors.Loading,
                // Utility.Interceptors.Notification,
                // Utility.Interceptors.Error,

                Utility.Interceptors.AccessTokenInterceptor,
                Utility.Interceptors.PrepareLocalHeadersInterceptor,
                Utility.Interceptors.ApprovalInterceptor,
                Utility.Interceptors.ParamsReplaceInterceptor,
                Utility.Interceptors.LoadingInterceptor,
                Utility.Interceptors.NotificationInterceptor,
                Utility.Interceptors.ErrorInterceptor,
                Utility.Interceptors.SourceInterceptor,
                Utility.Interceptors.ClearLocalHeadersInterceptor,
            ]),
        ),

        provideFirebaseApp(() => initializeApp(environment.firebase.options)),
        provideAnalytics(() => getAnalytics()),
        provideAuth(() => {
            const auth = getAuth();
            auth.setPersistence(browserLocalPersistence).catch((error) => {
                console.log(error);
            });
            if (
                environment.firebase.emulator.all ||
                environment.firebase.emulator.authorization
            ) {
                connectAuthEmulator(auth, 'http://localhost:9099');
            }
            return auth;
        }),
        importProvidersFrom(
            LoggerModule.forRoot({
                level: environment.production
                    ? NgxLoggerLevel.OFF
                    : NgxLoggerLevel.TRACE,
                serverLogLevel: NgxLoggerLevel.OFF,
            }),

            ScullyLibModule.forRoot({
                useTransferState: true,
                alwaysMonitor: true,
            }),

            NgxsModule.forRoot(
                [
                    AppState,
                    ClientState,
                    SpecialistState,
                    ServiceState,
                    PaymentState,
                    OrderState,
                    CartState,
                ],
                {
                    developmentMode: !environment.production,
                },
            ),
            NgxsReduxDevtoolsPluginModule.forRoot({
                disabled: environment.production,
            }),
            NgxsDispatchPluginModule.forRoot(),
            NgxsStoragePluginModule.forRoot({
                keys: [
                    CartState,
                ],
            }),
            NgxsSelectSnapshotModule.forRoot(),
            TranslateModule.forRoot({
                loader: {
                    provide: TranslateLoader,
                    useFactory: HttpLoaderFactory,
                    deps: [HttpClient],
                },
            }),
        ),
    ],
}).catch((e) => console.error(e));
