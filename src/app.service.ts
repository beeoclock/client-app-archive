import {inject, Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Settings} from "luxon";

@Injectable({
    providedIn: 'root',
})
export class AppService {
    public readonly translateService = inject(TranslateService);

    constructor() {
        Settings.defaultLocale = this.translateService.currentLang;
        this.translateService.onLangChange.subscribe(() => {
            localStorage.setItem('language', this.translateService.currentLang);
            Settings.defaultLocale = this.translateService.currentLang;
        });
    }
}
