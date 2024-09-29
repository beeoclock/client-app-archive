import {Component, inject, ViewEncapsulation} from '@angular/core';
import {CurrencyPipe} from '@angular/common';
import {DurationVersionHtmlHelper} from '@utility/helper/duration-version.html.helper';
import {ChangeLanguageComponent} from '@utility/presentation/component/change-language/change-language.component';
import {TranslateModule} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {CLIENT_ID} from '@src/token';
import {HeaderComponent} from '@utility/presentation/component/header/default/header.component';
import {CartDetailsComponent} from '@order/presentation/component/cart-details.component';

@Component({
    standalone: true,
    selector: 'event-form-page',
    template: `
        <utility-header-component
            (back)="back()"
            [title]="'cart.title' | translate"
        />
        <cart-details-component/>
    `,
    encapsulation: ViewEncapsulation.None,
    imports: [
        ChangeLanguageComponent,
        TranslateModule,
        HeaderComponent,
        CartDetailsComponent,
    ],
    providers: [DurationVersionHtmlHelper, CurrencyPipe],
})
export default class Index {
    private readonly router = inject(Router);
    private readonly CLIENT_ID$ = inject(CLIENT_ID);

    public back() {
        this.router.navigate(['/', this.CLIENT_ID$.value]);
    }
}
