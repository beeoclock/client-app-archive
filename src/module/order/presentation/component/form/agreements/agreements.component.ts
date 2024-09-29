import {Component, HostBinding, inject, Input, OnInit, ViewEncapsulation} from "@angular/core";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {NgForOf, NgIf} from "@angular/common";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {IsRequiredDirective} from "@utility/presentation/directives/is-required/is-required";
import {InvalidTooltipDirective} from "@utility/presentation/directives/invalid-tooltip/invalid-tooltip.directive";
import {HasErrorDirective} from "@utility/presentation/directives/has-error/has-error.directive";

@Component({
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    selector: 'agreements-component',
    imports: [
        NgForOf,
        ReactiveFormsModule,
        IsRequiredDirective,
        InvalidTooltipDirective,
        HasErrorDirective,
        NgIf,
        TranslateModule
    ],
    template: `
        <div class="flex items-start relative" *ngFor="let agreement of agreements; let index = index;">
            <input [formControl]="control" [id]="'agreement-' + index" isRequired type="checkbox"
                   class="p-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-800 dark:border-gray-600">
            <label [for]="'agreement-' + index" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                   [innerHTML]="agreement.labelHTML"></label>
        </div>
        <div *ngIf="control.touched && control.hasError('required')"
             class="bg-red-500 text-sm border border-red-900 mt-2 px-3 py-2 relative rounded-b-xl rounded-r-xl ml-[34px] text-white">
            {{ 'agreement.validation.required' | translate }}
        </div>
    `
})
export class AgreementsComponent implements OnInit {

    @Input({required: true})
    public control!: FormControl<boolean>;

    @HostBinding()
    public class = 'prose py-4';

    private readonly translateService = inject(TranslateService);

    public readonly agreements: {
        id: number;
        labelHTML: string;
        required: boolean;
        checked: boolean;
    }[] = [];

    public ngOnInit() {

        this.initAgreements();

    }

    private initAgreements() {
        const labelTranslateKey = 'agreements.termsOfUseAndPrivacyPolicy.label';
        const labelHTML = this.translateService.instant(labelTranslateKey, {
            terms_link: 'https://bee-o-clock.gitbook.io/home',
            privacy_link: 'https://bee-o-clock.gitbook.io/home/privacy-policy',
        });
        this.agreements.push({
            id: 1,
            labelHTML,
            required: true,
            checked: false
        });
    }

}

export default AgreementsComponent;
