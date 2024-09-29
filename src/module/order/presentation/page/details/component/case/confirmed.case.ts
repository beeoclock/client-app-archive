import {ChangeDetectionStrategy, Component, HostBinding, inject, ViewEncapsulation} from "@angular/core";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {CalendarTypeEnum} from "@utility/library/add-to-calendar/enum/calendar-type.enum";
import {AddToCalendarService} from "@utility/library/add-to-calendar";
import {NgIf} from "@angular/common";
import {OrderDetailsComponent} from "@order/presentation/page/details/component/details.component";
import {BaseCaseComponent} from "@order/presentation/page/details/component/case/base.case";
import {CancelOrderApiAdapter} from "@order/adapter/external/api/cancel.order.api.adapter";

@Component({
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'order-details-confirmed-case',
    imports: [
        TranslateModule,
        NgIf,
        OrderDetailsComponent
    ],
    template: `

        <div class="px-3 sm:px-0">

            <div class="mb-4 text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
                <div class="">
                    {{ 'event.details.status.booked.title' | translate }}
                </div>
            </div>
            <div class="text-base font-normal text-gray-200 lg:text-xl">
                {{ 'event.details.status.booked.hint' | translate }}
            </div>

        </div>

        <!--        <div class="w-full border-slate-600 bg-neutral-200 p-4 dark:bg-slate-800 sm:p-6 sm:rounded-2xl sm:border">-->
        <!--            <h5 class="mb-3 text-base font-semibold text-neutral-900 dark:text-white sm:text-xl">-->
        <!--                {{ 'library.addToCalendar.title' | translate }}-->
        <!--            </h5>-->
        <!--            <p class="text-sm font-normal text-gray-200">-->
        <!--                {{ 'library.addToCalendar.hint' | translate }}-->
        <!--            </p>-->
        <!--            <ul class="mt-3 grid grid-cols-2 gap-3">-->
        <!--                <li>-->
        <!--                    <button-->
        <!--                        (click)="addToGoogleCalendar()"-->
        <!--                        class="flex w-full items-center justify-center gap-3 rounded-lg border-2 border-slate-600 bg-yellow-400 p-3 text-sm font-bold uppercase text-slate-600 shadow transition-all duration-100 active:scale-95">-->
        <!--                        <i class="bi bi-google"></i>-->
        <!--                        <span class="truncate whitespace-nowrap">Google Calendar</span>-->
        <!--                    </button>-->
        <!--                </li>-->
        <!--                <li>-->
        <!--                    <button-->
        <!--                        (click)="addToICalendar()"-->
        <!--                        class="flex w-full items-center justify-center gap-3 rounded-lg border-2 border-slate-600 bg-yellow-400 p-3 text-sm font-bold uppercase text-slate-600 shadow transition-all duration-100 active:scale-95">-->
        <!--                        <i class="bi bi-apple"></i>-->
        <!--                        <span class="truncate whitespace-nowrap">iCalendar</span>-->
        <!--                    </button>-->
        <!--                </li>-->
        <!--                <li>-->
        <!--                    <button-->
        <!--                        (click)="addToOutLook()"-->
        <!--                        class="flex w-full items-center justify-center gap-3 rounded-lg border-2 border-slate-600 bg-yellow-400 p-3 text-sm font-bold uppercase text-slate-600 shadow transition-all duration-100 active:scale-95">-->
        <!--                        <i class="bi bi-microsoft"></i>-->
        <!--                        <span class="truncate whitespace-nowrap">OutLook</span>-->
        <!--                    </button>-->
        <!--                </li>-->
        <!--            </ul>-->
        <!--        </div>-->

        <order-details-component [item]="item"/>

        <ng-template [ngIf]="item.status === status.confirmed">
            <div class="p-4">
                <button
                    (click)="cancel()"
                    class="w-full rounded-2xl bg-red-500 px-4 py-2 text-white">
                    {{ 'keyword.capitalize.cancelOrder' | translate }}
                </button>
            </div>
        </ng-template>
    `
})
export class OrderDetailsConfirmedCaseComponent extends BaseCaseComponent {

    public readonly addToCalendarService = inject(AddToCalendarService);
    public readonly cancelOrderApiAdapter = inject(CancelOrderApiAdapter);
    public readonly translateService = inject(TranslateService);

    @HostBinding()
    public class = 'flex flex-col gap-4'

    private getLinkToCalendarFile(type: CalendarTypeEnum): string {

        return '';

        // return this.addToCalendarService.getHrefFor(type, {
        // duration: this.item.services[0].durationVersions[0].durationInSeconds / 60,
        // start: new Date(this.item.start),
        // title: this.item.services[0].languageVersions[0].title!
        // });
    }

    private openNewTabWithLink(link: string): void {
        window.open(link, '_blank');
    }

    public addToGoogleCalendar(): void {
        this.openNewTabWithLink(
            this.getLinkToCalendarFile(CalendarTypeEnum.google),
        );
    }

    public addToICalendar(): void {
        this.openNewTabWithLink(
            this.getLinkToCalendarFile(CalendarTypeEnum.iCalendar),
        );
    }

    public addToOutLook(): void {
        this.openNewTabWithLink(
            this.getLinkToCalendarFile(CalendarTypeEnum.outlook),
        );
    }

    public async cancel() {
        const question = this.translateService.instant('order.confirm.cancel.question');
        if (!confirm(question)) {
            return;
        }
        try {
            const result = await this.cancelOrderApiAdapter.executeAsync(this.item._id);
        } catch (e) {
            console.error(e);
        } finally {
            window.location.reload();
        }
    }
}
