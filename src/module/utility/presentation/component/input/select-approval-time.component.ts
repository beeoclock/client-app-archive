import {ChangeDetectionStrategy, Component, inject, Input, ViewEncapsulation,} from '@angular/core';
import {NgSelectModule} from '@ng-select/ng-select';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {ApprovalTimeEnum} from '@utility/domain/enum/approval-time.enum';

@Component({
  selector: 'select-approval-time-component',
  standalone: true,
  template: `
    <label
      class="block text-sm font-medium leading-6 text-beeColor-900 dark:text-beeDarkColor-300 dark:text-white"
      [for]="id"
    >
      {{ 'keyword.capitalize.approvalTime' | translate }}
    </label>
    <div class="text-sm text-beeColor-500">
      {{
        'client.profile.form.section.bookingSettings.input.approvalTime.placeholder'
          | translate
      }}
    </div>
    <ng-select
      bindLabel="name"
      bindValue="seconds"
      [items]="approvalTimeList"
      [clearable]="false"
      [id]="id"
      [formControl]="control"
    >
    </ng-select>
  `,
  encapsulation: ViewEncapsulation.None,
  imports: [NgSelectModule, ReactiveFormsModule, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectApprovalTimeComponent {
  @Input()
  public id: string = '';

  @Input()
  public control = new FormControl();

  public readonly translateService = inject(TranslateService);

  public readonly approvalTimeList = Object.values(ApprovalTimeEnum)
    .filter((approvalTimeName) => typeof approvalTimeName === 'string')
    .map((approvalTimeName) => {
      return {
        name: this.translateService.instant(`approvalTime.${approvalTimeName}`),
        seconds:
          ApprovalTimeEnum[approvalTimeName as keyof typeof ApprovalTimeEnum],
      };
    });
}
