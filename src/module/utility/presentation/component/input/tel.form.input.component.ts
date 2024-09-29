import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    DoCheck,
    ElementRef,
    HostBinding,
    inject,
    Input,
    OnDestroy,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';
import {IsRequiredDirective} from '@utility/presentation/directives/is-required/is-required';
import {InvalidTooltipDirective} from '@utility/presentation/directives/invalid-tooltip/invalid-tooltip.directive';
import intlTelInput from 'intl-tel-input';
import {is} from '@utility/checker';

@Component({
    selector: 'tel-form-input',
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        IsRequiredDirective,
        InvalidTooltipDirective,
        NgIf,
        ReactiveFormsModule,
    ],
    template: `
        <label
            *ngIf="showLabel"
            [for]="id"
            class="block text-sm font-medium leading-6 text-beeColor-900 dark:text-white"
        >
            {{ label }}
        </label>
        <input
            hidden
            isRequired
            invalidTooltip
            [id]="id"
            [formControl]="control"
            [isRequiredEnabled]="showLabel">

        <input
            #inputElement
            [class.disabled]="disabled"
            [placeholder]="placeholder"
            [autocomplete]="autocomplete"
            type="tel"
            class="w-full rounded-md border border-gray-800 bg-gray-800 px-3 py-2 text-white placeholder:text-slate-600"
        />
    `,
})
export class TelFormInputComponent implements AfterViewInit, OnDestroy, DoCheck {
    @Input()
    public label = 'todo';

    @Input()
    public showLabel = true;

    @Input()
    public id = 'utility-base-input';

    @Input()
    public placeholder: string = '';

    @Input()
    public autocomplete: string = '';

    @Input()
    public disabled = false;

    @Input()
    public control!: FormControl;

    @ViewChild('inputElement', {static: true})
    public inputElement!: ElementRef<HTMLInputElement>;

    @HostBinding()
    public class = 'block';

    public intlTelInput: unknown | null = null;

    private readonly changeDetectorRef = inject(ChangeDetectorRef);

    public ngDoCheck(): void {
        this.changeDetectorRef.detectChanges();
    }

    public ngAfterViewInit() {
        this.intlTelInput = intlTelInput(this.inputElement.nativeElement, {
            initialCountry: 'auto',
            // @ts-ignore
            strictMode: true,
            separateDialCode: true,
            // @ts-ignore
            countryOrder: ['dk', 'pl', 'ua'],
            utilsScript: 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/23.1.1/js/utils.js',
            geoIpLookup: callback => {
                fetch("https://freeipapi.com/api/json")
                    .then(res => res.json())
                    .then(data => callback(data.countryCode))
                    .catch(() => callback("us"));
            }
        });

        // @ts-ignore
        is.string_not_empty(this.control.value) && this.intlTelInput?.setNumber(this.control.value);

        this.inputElement.nativeElement.addEventListener('countrychange', () => {
            // @ts-ignore
            this.control.setValue(this.intlTelInput?.getNumber());
        });

        this.inputElement.nativeElement.addEventListener('input', () => {
            // @ts-ignore
            this.control.setValue(this.intlTelInput?.getNumber());
            // @ts-ignore
            !this.intlTelInput.isValidNumber() && this.control.setErrors({
                'invalid': true
            });

        });
    }

    public ngOnDestroy() {
        // @ts-ignore
        this.intlTelInput?.['destroy']?.();
    }

}
