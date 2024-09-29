import {ChangeDetectionStrategy, ChangeDetectorRef, Component, DoCheck, inject, Input, OnInit,} from '@angular/core';
import {AttendantComponent} from '@order/presentation/component/form/attendees/attendant/attendant.component';
import {NgForOf, NgIf} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {AttendeesFormArray} from '@order/presentation/form/attendant.form';

@Component({
  selector: 'event-attendees-component',
  templateUrl: 'attendees.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AttendeesComponent,
    AttendantComponent,
    NgForOf,
    TranslateModule,
    NgIf,
  ],
})
export class AttendeesComponent implements OnInit, DoCheck {
  @Input()
  public form!: AttendeesFormArray;

  public readonly changeDetectorRef = inject(ChangeDetectorRef);

  public ngOnInit(): void {
    this.form.valueChanges.subscribe(() => {
      this.changeDetectorRef.markForCheck();
    });
  }

  public remove(index: number): void {
    this.form.removeAt(index);
  }

  public ngDoCheck(): void {
    this.changeDetectorRef.detectChanges();
  }
}
