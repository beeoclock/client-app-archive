import {Component, Input, ViewEncapsulation} from '@angular/core';
import {NgClass, NgForOf} from '@angular/common';

@Component({
    selector: 'stepper-component',
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    imports: [NgForOf, NgClass],
    template: `
        <ol class="flex w-full items-center justify-center">
            <li class="flex items-center">
        <span
            [ngClass]="{
            'bg-yellow-400': firstStepIsActive,
            'bg-gray-800': !firstStepIsActive,
          }"
            class="flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
        >
        </span>
            </li>
            <li
                *ngFor="let step of stepsArray"
                [ngClass]="{
          'before:border-yellow-400': step.active,
          'before:border-gray-800': !step.active,
        }"
                class="flex w-full items-center text-blue-600 before:inline-block before:h-1 before:w-full before:border-4 before:border-b before:content-[''] dark:text-blue-500"
            >
        <span
            [ngClass]="{
            'bg-yellow-400': step.active,
            'bg-gray-800': !step.active,
          }"
            class="flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
        >
        </span>
            </li>
        </ol>
    `,
})
export class StepperComponent {
    @Input()
    public steps: number = 3;

    @Input()
    public activeStep: number = 1;

    public get stepsArray(): {
        index: number;
        active: boolean;
    }[] {
        return Array(this.steps)
            .fill(0)
            .map((_, index) => {
                index++;
                return {
                    index,
                    active: index <= this.activeStep,
                };
            });
    }

    public get firstStepIsActive(): boolean {
        return 0 <= this.activeStep;
    }
}
