import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    HostBinding,
    inject,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {
    SelectTimeSlotComponent
} from '@order/presentation/component/form/service/select-slot/index/select-time-slot.component';
import {Reactive} from '@utility/cdk/reactive';
import {ActivatedRoute, Router} from '@angular/router';
import {AsyncPipe, NgIf} from '@angular/common';
import {CompositorLocalService} from '@order/presentation/component/stepper/step/providers/compositor.local.service';
import {BusySlotsLocalService} from '@order/presentation/component/stepper/step/providers/busy-slots.local.service';
import {SlotsLocalService} from '@order/presentation/component/stepper/step/providers/slots.local.service';
import {map} from 'rxjs';
import {FormControl} from "@angular/forms";
import {
    SelectSpecialistCircleComponent
} from "@order/presentation/component/form/service/select-specialist-circle/select-specialist-circle.component";

@Component({
    selector: 'time-slot-and-specialist-step',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        SelectTimeSlotComponent,
        TranslateModule,
        NgIf,
        AsyncPipe,
        SelectSpecialistCircleComponent,
    ],
    providers: [CompositorLocalService, BusySlotsLocalService, SlotsLocalService],
    template: `
        @if (assignedToServiceId$ | async; as assignedToServiceId) {

            @if (assignedToServiceId) {

                <select-specialist-circle
                    [assignedToServiceId]="assignedToServiceId"
                    [control]="specialistControl"
                />

            }

            <event-select-slot-form-component [control]="startControl"/>

        }

        <button
            (click)="gotToNextStep()"
            [disabled]="loader.isOn || startControl.value === null"
            type="button"
            class="flex w-full items-center justify-center rounded-lg border-2 border-slate-600 bg-yellow-400 py-4 font-bold uppercase text-slate-600 shadow transition-all duration-100 active:scale-95"
        >
            {{ 'keyword.capitalize.nextStep' | translate }}
        </button>
    `,
})
export class TimeSlotAndSpecialistStepComponent extends Reactive implements OnInit {

    @HostBinding()
    public class = 'mb-32 block';

    public readonly startControl: FormControl<string | null> = new FormControl(null);
    public readonly specialistControl = new FormControl<string | null>(null);

    private readonly compositorLocalService = inject(CompositorLocalService);
    private readonly slotsLocalService = inject(SlotsLocalService);
    private readonly changeDetectorRef = inject(ChangeDetectorRef);
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly router = inject(Router);

    public readonly loader = this.slotsLocalService.loader;

    public readonly assignedToServiceId$ =
        this.compositorLocalService.cartService$.pipe(
            this.takeUntil(),
            map((cartService) => {
                this.changeDetectorRef.detectChanges();
                return cartService?.service?._id;
            }),
        );

    public gotToNextStep() {
        this.router.navigate(['../../', 'cart'], {
            relativeTo: this.activatedRoute,
        });
    }

    public ngOnInit() {

        this.specialistControl.valueChanges.pipe(this.takeUntil()).subscribe((specialistId: string | null) => {
            this.compositorLocalService.selectSpecialist(specialistId);
            this.startControl.setValue(null);
            this.compositorLocalService.clearSlot();
        });
    }
}
