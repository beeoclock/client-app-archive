import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    inject,
    Input,
    OnChanges,
    SimpleChange,
    SimpleChanges,
    ViewEncapsulation
} from "@angular/core";
import {ButtonArrowComponent} from "@order/presentation/component/form/service/select-slot/button.arrow.component";
import {NgIf} from "@angular/common";
import {environment} from "@environments/environment";
import {DateTime} from "luxon";
import {NGXLogger} from "ngx-logger";
import {CompositorLocalService} from "@order/presentation/component/stepper/step/providers/compositor.local.service";
import {SlotsLocalService} from "@order/presentation/component/stepper/step/providers/slots.local.service";
import {IDayItem} from "@order/utility/interface/i.day.item";

@Component({
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        ButtonArrowComponent,
        NgIf
    ],
    selector: 'order-header-select-date-component',
    template: `

        <!-- Navigation Buttons -->
        <event-select-slot-button-arrow-component
            [left]="true"
            (click)="prevPackOfDates()"
        />
        <div class="font-medium text-center tracking-wide">{{ daySlotsTitle }}</div>
        <div *ngIf="!daySlotsTitle?.length" class="animate-pulse w-full h-5 rounded-full bg-gray-400"></div>
        <!-- Navigation Buttons -->
        <event-select-slot-button-arrow-component
            [right]="true"
            (click)="nextPackOfDates()"
        />

    `
})
export class HeaderSelectDateComponent implements OnChanges {

    @Input({required: true})
    public dayItemList: IDayItem[] = [];

    @HostBinding()
    public class = 'flex items-center justify-between gap-2';

    public daySlotsTitle = '';

    readonly #ngxLogger = inject(NGXLogger);
    readonly #compositorLocalService = inject(CompositorLocalService);
    readonly #slotsLocalService = inject(SlotsLocalService);

    public ngOnChanges(changes: SimpleChanges & { dayItemList: SimpleChange }) {

        if (changes?.dayItemList?.currentValue?.length) {
            this.initDaySlotTitle();
        }

    }

    public prevPackOfDates(): void {
        if (!this.dayItemList.length) {
            return;
        }
        const {0: firstDayItem} = this.dayItemList;
        if (firstDayItem.isToday) {
            return;
        }
        const {datetime} = firstDayItem;
        this.processNewStartDateTime(
            datetime.minus(environment.config.slots.selectDay.step),
        ).then();
    }

    public nextPackOfDates(): void {
        if (!this.dayItemList.length) {
            return;
        }
        const lastItem = this.dayItemList[this.dayItemList.length - 1];
        this.processNewStartDateTime(lastItem.datetime.plus({day: 1})).then();
    }

    public async processNewStartDateTime(sourceDatetime: DateTime) {
        this.#ngxLogger.debug('processNewStartDateTime', sourceDatetime);
        await this.#compositorLocalService.buildDayItemList(sourceDatetime);
    }

    public initDaySlotTitle(): void {
        if (!this.dayItemList.length) {
            return;
        }
        const firstItem = this.dayItemList[0];
        const lastItem = this.dayItemList[this.dayItemList.length - 1];

        if (firstItem.datetime.hasSame(lastItem.datetime, 'month')) {

            this.daySlotsTitle = `${firstItem.datetime.toFormat('d')} - ${lastItem.datetime.toFormat('d')} ${lastItem.datetime.toFormat('LLL')}`;

            if (!this.#slotsLocalService.now.hasSame(firstItem.datetime, 'year')) {
                this.daySlotsTitle += ` ${firstItem.datetime.toFormat('yyyy')}`;
            }

            return;
        }

        if (firstItem.datetime.hasSame(lastItem.datetime, 'year')) {

            this.daySlotsTitle = `${firstItem.datetime.toFormat('d LLL')} - ${lastItem.datetime.toFormat('d LLL')}`;

            if (!this.#slotsLocalService.now.hasSame(firstItem.datetime, 'year')) {
                this.daySlotsTitle += ` ${firstItem.datetime.toFormat('yyyy')}`;
            }

            return;
        }

        this.daySlotsTitle = `${firstItem.datetime.toFormat('d LLL yyyy')} - ${lastItem.datetime.toFormat('d LLL yyyy')}`;

    }

}
