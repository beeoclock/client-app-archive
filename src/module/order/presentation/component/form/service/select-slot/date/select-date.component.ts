import {ChangeDetectorRef, Component, ElementRef, inject, Input, ViewChild,} from '@angular/core';
import {FormControl} from '@angular/forms';
import {DateTime} from 'luxon';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {AsyncPipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {Reactive} from '@utility/cdk/reactive';
import {BooleanStreamState} from '@utility/domain/boolean-stream.state';
import {NGXLogger} from 'ngx-logger';
import {environment} from '@environments/environment';
import {IDayItem} from '@order/utility/interface/i.day.item';
import {ButtonArrowComponent} from '@order/presentation/component/form/service/select-slot/button.arrow.component';
import {SlotsLocalService} from '../../../../stepper/step/providers/slots.local.service';
import {CompositorLocalService} from '@order/presentation/component/stepper/step/providers/compositor.local.service';
import {
    HeaderSelectDateComponent
} from "@order/presentation/component/form/service/select-slot/date/section/header.select-date.component";

@Component({
    selector: 'event-select-slot-date-form-component',
    templateUrl: './select-date.component.html',
    standalone: true,
    imports: [
        NgForOf,
        NgClass,
        NgIf,
        TranslateModule,
        AsyncPipe,
        ButtonArrowComponent,
        HeaderSelectDateComponent,
    ],
})
export class SelectDateComponent
    extends Reactive {

    @Input({required: true})
    public dayItemList: IDayItem[] = [];

    @Input()
    public control!: FormControl<string | null>;

    @Input()
    public localDateTimeControl!: FormControl<DateTime | null>;

    @ViewChild('daySlotsContainer')
    public daySlotsContainer!: ElementRef<HTMLDivElement>;

    public readonly translateService = inject(TranslateService);
    public readonly slotsLocalService = inject(SlotsLocalService);
    public readonly compositorLocalService = inject(CompositorLocalService);
    public readonly ngxLogger = inject(NGXLogger);
    public readonly changeDetectorRef = inject(ChangeDetectorRef);

    public readonly arrayOfEmptySlots = new Array(environment.config.slots.selectDay.step.days);

    public get loader(): BooleanStreamState {
        return this.slotsLocalService.loader;
    }

    public isDisabled(dayItem: IDayItem): boolean {

        const {specialistId} = this.compositorLocalService.cartService ?? {};

        if (!specialistId) {
            this.ngxLogger.debug('SelectDateComponent:isDisabled', dayItem);
            return dayItem.isDisabled;
        }

        return !dayItem.slots.bySpecialist[specialistId]?.length;

    }

    public select(dayItem: IDayItem) {
        this.selectDateItem(dayItem.datetime);
    }

    /**
     *
     * @param datetime
     */
    public selectDateItem(datetime: DateTime): void {
        this.localDateTimeControl.patchValue(datetime);
        this.changeDetectorRef.detectChanges();
    }

    /**
     *
     * @param datetime
     */
    public isSelected(datetime: DateTime): boolean {
        if (!this.localDateTimeControl.value) {
            return false;
        }
        return datetime.hasSame(this.localDateTimeControl.value, 'day');
    }

    public hasSelectedTimeSlot(datetime: DateTime): boolean {
        if (!this.control.value) {
            return false;
        }
        return DateTime.fromISO(this.control.value).hasSame(datetime, 'day');
    }

}
