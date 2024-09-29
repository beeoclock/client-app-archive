import {Component, inject, Input, ViewEncapsulation} from '@angular/core';
import {AsyncPipe, NgIf} from '@angular/common';
import {ItemOnListV2Component} from '@specialist/presentation/component/item/item-on-list.v2.component';
import {LoaderComponent} from '@utility/presentation/component/loader/loader.component';
import {NoteComponent} from '@order/presentation/component/form/note/note.component';
import {TranslateModule} from '@ngx-translate/core';
import {Store} from '@ngxs/store';
import {AttendeesComponent} from '@order/presentation/component/form/attendees/attendees.component';
import {AttendeesFormArray} from '@order/presentation/form/attendant.form';

@Component({
    selector: 'attendant-step',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        AsyncPipe,
        ItemOnListV2Component,
        LoaderComponent,
        NgIf,
        NoteComponent,
        TranslateModule,
        AttendeesComponent,
    ],
    template: `
        <div class="text-lg font-bold">
            {{ 'keyword.capitalize.personalInformation' | translate }}
        </div>
        <event-attendees-component [form]="attendeesControl"/>
    `,
})
export class AttendantStepComponent {

    @Input({required: true})
    public attendeesControl!: AttendeesFormArray;

    public readonly store = inject(Store);

    public checkAttendees(): boolean {
        this.attendeesControl.submit();
        if (this.attendeesControl.invalid) {
            return false;
        }
        return true;
    }

}
