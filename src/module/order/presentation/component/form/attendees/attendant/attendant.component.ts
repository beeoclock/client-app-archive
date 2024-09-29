import {ChangeDetectionStrategy, ChangeDetectorRef, Component, DoCheck, inject, Input, OnInit,} from '@angular/core';
import {ReactiveFormsModule, Validators} from '@angular/forms';

import {AsyncPipe, NgIf} from '@angular/common';
import {HasErrorDirective} from '@utility/presentation/directives/has-error/has-error.directive';
import {IsRequiredDirective} from '@utility/presentation/directives/is-required/is-required';
import {InvalidTooltipDirective} from '@utility/presentation/directives/invalid-tooltip/invalid-tooltip.directive';
import {FormInputComponent} from '@utility/presentation/component/input/form.input.component';
import {TranslateModule} from '@ngx-translate/core';
import {InvalidTooltipComponent} from '@utility/presentation/component/invalid-message/invalid-message';
import {AttendantForm} from '@order/presentation/form/attendant.form';
import {Select} from '@ngxs/store';
import {ClientState} from '@client/state/client/client.state';
import {map, Observable} from 'rxjs';
import {IClient} from '@client/domain';
import {atLeastOneFieldMustBeFilledValidator} from '@utility/validation';
import {TelFormInputComponent} from "@utility/presentation/component/input/tel.form.input.component";

@Component({
    selector: 'event-attendant-component',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        ReactiveFormsModule,
        NgIf,
        HasErrorDirective,
        IsRequiredDirective,
        InvalidTooltipDirective,
        FormInputComponent,
        TranslateModule,
        InvalidTooltipComponent,
        AsyncPipe,
        TelFormInputComponent,
    ],
    template: `
        <form class="flex flex-col gap-4">
            <form-input
                inputType="text"
                autocomplete="firstname"
                [placeholder]="'keyword.capitalize.firstName' | translate"
                [control]="form.controls.firstName"
                [label]="'keyword.capitalize.firstName' | translate"
            />

            <div>
                <form-input
                    inputType="email"
                    autocomplete="email"
                    placeholder="firstname.lastname@example.com"
                    id="client-app-event-attendant-email-input"
                    [control]="form.controls.email"
                    [label]="'keyword.capitalize.email' | translate"
                />

                <p
                    *ngIf="emailIsOptional$ | async"
                    class="p-3 text-sm italic text-gray-400"
                >
                    {{ 'event.form.section.attendant.input.email.hint' | translate }}
                </p>
            </div>

            <!--            <form-input-->
            <!--                inputType="tel"-->
            <!--                autocomplete="phone"-->
            <!--                id="client-app-event-attendant-phone-input"-->
            <!--                [control]="form.controls.phone"-->
            <!--                [label]="'keyword.capitalize.phone' | translate"-->
            <!--            />-->

            <tel-form-input
                autocomplete="phone"
                id="client-app-event-attendant-phone-input"
                [control]="form.controls.phone"
                [label]="'keyword.capitalize.phone' | translate"
            />
        </form>

        <div
            class="mt-2"
            [class.hidden]="
        form.controls.phone.untouched || form.controls.email.untouched
      "
        >
            <utility-invalid-message class="flex justify-center" [control]="form"/>
        </div>
    `,
})
export class AttendantComponent implements DoCheck, OnInit {
    @Input()
    public form!: AttendantForm;

    private readonly changeDetectorRef = inject(ChangeDetectorRef);

    @Select(ClientState.item)
    public readonly client$!: Observable<IClient>;

    public readonly mandatoryAttendeeProperties$ = this.client$.pipe(
        map((client) => client?.bookingSettings?.mandatoryAttendeeProperties || []),
    );

    public readonly emailIsOptional$ = this.mandatoryAttendeeProperties$.pipe(
        map(
            (mandatoryAttendeeProperties) =>
                !mandatoryAttendeeProperties?.includes('email'),
        ),
    );

    public ngDoCheck(): void {
        this.changeDetectorRef.detectChanges();
    }

    public ngOnInit() {
        this.mandatoryAttendeeProperties$.subscribe(
            (mandatoryAttendeeProperties) => {
                if (!mandatoryAttendeeProperties?.length) {
                    this.form.addValidators([
                        atLeastOneFieldMustBeFilledValidator(['_id']),
                    ]);
                    return;
                }
                mandatoryAttendeeProperties?.forEach((property) => {
                    const control = this.form.get(property);
                    if (control) {
                        control.addValidators([Validators.required]);
                    }
                });
            },
        );
    }
}
