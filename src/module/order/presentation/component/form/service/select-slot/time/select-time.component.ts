import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    inject,
    Input,
    OnChanges,
    SimpleChange,
    SimpleChanges,
    ViewEncapsulation,
} from '@angular/core';
import {FormControl} from '@angular/forms';
import {DateTime} from 'luxon';
import {TranslateModule} from '@ngx-translate/core';
import {AsyncPipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {Reactive} from '@utility/cdk/reactive';
import {LoaderComponent} from '@utility/presentation/component/loader/loader.component';
import {NGXLogger} from 'ngx-logger';
import {ButtonArrowComponent} from '@order/presentation/component/form/service/select-slot/button.arrow.component';
import {SlotsLocalService} from '@order/presentation/component/stepper/step/providers/slots.local.service';
import {CompositorLocalService} from '@order/presentation/component/stepper/step/providers/compositor.local.service';

@Component({
    standalone: true,
    selector: 'event-select-slot-time-form-component',
    templateUrl: './select-time.component.html',
    imports: [
        NgForOf,
        NgClass,
        LoaderComponent,
        NgIf,
        TranslateModule,
        ButtonArrowComponent,
        AsyncPipe,
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectTimeComponent extends Reactive implements OnChanges {

    @Input({required: true})
    public slots!: {
        specialistIds: string[];
        start: DateTime;
        end: DateTime;
    }[];

    @Input({required: true})
    public control!: FormControl<string | null>;

    @Input({required: true})
    public localDateTimeControl!: FormControl<DateTime | null>;

    public readonly arrayOfEmptySlot = new Array(9);

    private readonly ngxLogger = inject(NGXLogger);
    private readonly slotsLocalService = inject(SlotsLocalService);
    private readonly compositorLocalService = inject(CompositorLocalService);
    private readonly changeDetectorRef = inject(ChangeDetectorRef);

    public readonly loader = this.slotsLocalService.loader;

    public ngOnChanges(changes: SimpleChanges & {
        slots: SimpleChange;
        control: SimpleChange;
        localDateTimeControl: SimpleChange;
    }) {
        if (changes.slots) {
            this.ngxLogger.debug('ngOnChanges:slots', this.slots);
            this.changeDetectorRef.detectChanges();
        }
    }

    public selectSlot(slot: {
        start: DateTime;
        end: DateTime;
        specialistIds: string[];
    }): void {
        this.updateControlsValue(slot);
        this.compositorLocalService.selectSlot(slot);
    }

    public updateControlsValue(slot: { start: DateTime; end: DateTime; }): void {

        this.control.patchValue(slot.start.toJSDate().toISOString());
        this.localDateTimeControl.patchValue(slot.start, {
            emitEvent: false,
            onlySelf: true,
        });

    }

    public isSelected(datetime: DateTime): boolean {
        const controlValue = this.control.value;
        if (!controlValue) {
            return false;
        }
        const selectedDateTime = DateTime.fromISO(controlValue);
        return datetime.hasSame(selectedDateTime, 'minute');
    }
}
