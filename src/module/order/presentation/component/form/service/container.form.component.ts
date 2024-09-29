import {ChangeDetectionStrategy, Component, HostBinding, inject, OnInit, ViewEncapsulation,} from '@angular/core';
import {Reactive} from '@utility/cdk/reactive';
import {ActivatedRoute, Router} from '@angular/router';
import {NGXLogger} from 'ngx-logger';
import {CLIENT_ID} from '@src/token';
import {StepEnum} from '@order/enum/step.enum';
import {
    TimeSlotAndSpecialistStepComponent
} from '@order/presentation/component/stepper/step/time-slot-and-specialist.step.component';
import {ServiceStepComponent} from '@order/presentation/component/stepper/step/service.step.component';
import {NgSwitch, NgSwitchCase} from '@angular/common';
import {ContainerFormLocalService} from '@order/presentation/component/form/service/container.form.local.service';

/**
 * Container service form component
 * @description енкасульований компонент для того, щоб мати можливість використовувати його в інших компонентах без втрати та напрягів
 */

@Component({
    standalone: true,
    selector: 'container-form',
    templateUrl: './container.form.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        TimeSlotAndSpecialistStepComponent,
        ServiceStepComponent,
        NgSwitch,
        NgSwitchCase,
    ],
    providers: [ContainerFormLocalService],
})
export class ContainerFormComponent extends Reactive implements OnInit {
    public readonly activatedRoute = inject(ActivatedRoute);
    public readonly ngxLogger = inject(NGXLogger);
    public readonly containerFormLocalService = inject(ContainerFormLocalService);
    public readonly CLIENT_ID$ = inject(CLIENT_ID);
    public readonly router = inject(Router);

    @HostBinding()
    public readonly class = 'block w-full';

    public readonly stepEnum = StepEnum;

    public get currentStep() {
        return this.containerFormLocalService.currentStep;
    }

    public ngOnInit(): void {
        this.activatedRoute.data.pipe(this.takeUntil()).subscribe(({step}) => {
            this.ngxLogger.debug('order:form:Index:ngOnInit:step', step);
            step && this.containerFormLocalService.goToNextStep(step);
        });
    }
}
