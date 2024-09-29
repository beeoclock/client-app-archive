import {Injectable} from '@angular/core';
import {StepEnum} from '@order/enum/step.enum';
import {BehaviorSubject} from 'rxjs';

@Injectable()
export class ContainerFormLocalService {
    public readonly stepHistory$ = new BehaviorSubject<StepEnum[]>([
        StepEnum.service,
    ]);

    public get currentStep(): StepEnum {
        return this.stepHistory$.value[this.stepHistory$.value.length - 1];
    }

    public goToNextStep(force?: StepEnum) {
        const step = force ?? this.getNextStep();
        this.stepHistory$.next([...this.stepHistory$.value, step]);
    }

    public getNextStep() {
        switch (this.currentStep) {
            case StepEnum.service:
                return StepEnum.timeSlotAndSpecialist;
            case StepEnum.timeSlotAndSpecialist:
                return StepEnum.confirmationAndAttendees;
            case StepEnum.confirmationAndAttendees:
                return StepEnum.service;
        }
    }
}
