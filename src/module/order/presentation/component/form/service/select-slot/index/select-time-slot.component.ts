import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    inject,
    Input,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import {FormControl} from '@angular/forms';
import {DateTime} from 'luxon';
import {InvalidTooltipComponent} from '@utility/presentation/component/invalid-message/invalid-message';
import {HumanizeDurationPipe} from '@utility/presentation/pipe/humanize-duration.pipe';
import {DynamicDatePipe} from '@utility/presentation/directives/dynamic-date.pipe';
import {BooleanStreamState} from '@utility/domain/boolean-stream.state';
import {LoaderComponent} from '@utility/presentation/component/loader/loader.component';
import {SelectDateComponent} from '@order/presentation/component/form/service/select-slot/date/select-date.component';
import {SelectTimeComponent} from '@order/presentation/component/form/service/select-slot/time/select-time.component';
import {AsyncPipe, NgIf} from '@angular/common';
import {SlotsLocalService} from '@order/presentation/component/stepper/step/providers/slots.local.service';
import {NGXLogger} from "ngx-logger";
import {is} from '@utility/checker';
import {IDayItem} from "@order/utility/interface/i.day.item";
import {Reactive} from "@utility/cdk/reactive";
import {CompositorLocalService} from "@order/presentation/component/stepper/step/providers/compositor.local.service";
import {combineLatest, filter, map} from "rxjs";

@Component({
    selector: 'event-select-slot-form-component',
    templateUrl: './select-time-slot.component.html',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    imports: [
        InvalidTooltipComponent,
        SelectDateComponent,
        SelectTimeComponent,
        HumanizeDurationPipe,
        DynamicDatePipe,
        LoaderComponent,
        NgIf,
        AsyncPipe,
    ],
})
export class SelectTimeSlotComponent extends Reactive implements OnInit {

    @Input({required: true})
    public control!: FormControl<string | null>;

    public dayItemList: IDayItem[] = [];

    @Input()
    public editable = true;

    public readonly localDateTimeControl: FormControl<DateTime | null> = new FormControl();

    public readonly ngxLogger = inject(NGXLogger);
    public readonly slotsLocalService = inject(SlotsLocalService);
    public readonly compositorLocalService = inject(CompositorLocalService);
    public readonly changeDetectorRef = inject(ChangeDetectorRef);

    public slots: {
        specialistIds: string[];
        start: DateTime;
        end: DateTime;
    }[] = [];

    private previousDateTime: DateTime | null = null;
    public readonly slotsSubscription$ = combineLatest([
        this.localDateTimeControl.valueChanges.pipe(
            filter((value) => {
                if (value === null) {
                    return false;
                }
                if (this.previousDateTime === null) {
                    this.previousDateTime = value;
                    return true;
                }
                const isSame = value.equals(this.previousDateTime);
                this.previousDateTime = value;
                return !isSame;
            })
        ),
        this.compositorLocalService.cartService$,
    ]).pipe(
        map(({0: dateTime, 1: cartService}) => {
            this.ngxLogger.debug('SelectTimeSlotComponent:slotsSubscription$', dateTime, cartService);
            if (!dateTime || !cartService) {
                return;
            }
            const slots = this.slotsLocalService.getSlotsByDay(dateTime);
            this.ngxLogger.debug('SelectTimeSlotComponent:slots$', slots);
            const {specialistId} = cartService;
            if (specialistId) {
                if (specialistId in slots.bySpecialist) {
                    return slots.bySpecialist[specialistId].map((slot) => {
                        return {
                            ...slot,
                            specialistIds: [specialistId],
                        }
                    });
                }
                return [];
            }
            return Object.values(slots.byStartISO);
        })
    ).subscribe((slots) => {
        if (!slots) {
            return;
        }
        this.slots = slots;
        this.changeDetectorRef.detectChanges();
    });

    public get loader(): BooleanStreamState {
        return this.slotsLocalService.loader;
    }

    public ngOnInit() {

        this.compositorLocalService.buildDayItemList(this.slotsLocalService.now);

        this.slotsLocalService.dayItemList$
            .pipe(this.takeUntil(), filter(is.array_not_empty<IDayItem[]>))
            .subscribe((dayItemList) => {
                this.ngxLogger.debug('SelectDateComponent:dayItemList', dayItemList);
                this.dayItemList = dayItemList;
                if (
                    this.compositorLocalService.slotIsNotSelected ||
                    this.control.value === null
                ) {
                    this.initFirstSelectedSlot();
                }
                this.changeDetectorRef.detectChanges();
            });

        // Handle changes of specialist to run changeDetection
        this.compositorLocalService.cartService$
            .pipe(this.takeUntil())
            .subscribe(() => {
                this.changeDetectorRef.detectChanges();
                if (
                    this.control.value === null
                ) {
                    this.initFirstSelectedSlot();
                }
            });

    }

    public initFirstSelectedSlot(): void {

        this.ngxLogger.debug('SelectDateComponent:initFirstSelectedSlot');
        const {specialistId} = this.compositorLocalService.cartService ?? {};

        for (const dayItem of this.dayItemList) {
            let found = false;
            let slots: any = Object.values(dayItem.slots.byStartISO);
            if (specialistId) {
                slots = dayItem.slots.bySpecialist[specialistId];
            }
            for (const slot of slots) {
                this.ngxLogger.debug('SelectDateComponent:initFirstSelectedSlot', slot);
                this.control.setValue(slot.start.toJSDate().toISOString());
                this.localDateTimeControl.setValue(slot.start);
                this.compositorLocalService.selectSlot(slot);
                found = true;
                return;
            }
            if (found) {
                return;
            }
        }
    }
}
