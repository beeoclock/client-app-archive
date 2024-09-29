import {ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, ViewEncapsulation,} from '@angular/core';
import {AsyncPipe, CurrencyPipe, NgForOf, NgIf} from '@angular/common';
import {LoaderComponent} from '@utility/presentation/component/loader/loader.component';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {IService} from '@service/domain';
import {BooleanState} from '@utility/domain';
import {tap} from 'rxjs';
import {HumanizeDurationPipe} from '@utility/presentation/pipe/humanize-duration.pipe';
import {Store} from '@ngxs/store';
import {ServiceState} from '@service/state/service/service.state';

@Component({
  selector: 'utility-modal-select-service-component',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgForOf,
    LoaderComponent,
    NgIf,
    TranslateModule,
    CurrencyPipe,
    AsyncPipe,
    HumanizeDurationPipe,
  ],
  template: `
    <div class="flex flex-col gap-4">
      <ng-container *ngFor="let item of list$ | async; let index = index">
        <hr class="my-2 dark:border-beeDarkColor-700" *ngIf="index > 0" />

        <div class="flex flex-col gap-3 dark:text-white">
          <div class="grid grid-cols-16 gap-4">
            <div
              *ngIf="item?.presentation?.banners?.[0]"
              class="col-span-3 pt-1"
            >
              <ng-container
                *ngIf="
                  item?.presentation?.banners?.length;
                  else DefaultServiceImageTemplate
                "
              >
                <img
                  [src]="item.presentation.banners[0]"
                  class="h-[90px] w-[90px] rounded-2xl object-cover"
                  alt="Image of service"
                />
              </ng-container>
              <ng-template #DefaultServiceImageTemplate>
                <div
                  class="h-[90px] w-[90px] rounded-2xl bg-beeColor-300"
                ></div>
              </ng-template>
            </div>
            <div
              class="flex flex-col gap-2"
              [class.col-span-10]="item?.presentation?.banners?.[0]"
              [class.col-span-13]="!item?.presentation?.banners?.[0]"
            >
              <div class="flex flex-col gap-2">
                <span class="font-bold">
                  {{ item.languageVersions[0].title }}
                </span>
                <span class="text-sm text-beeColor-500">
                  {{ item.languageVersions[0].description }}
                </span>
              </div>
            </div>
            <div class="col-span-3 flex flex-col gap-3">
              <button
                *ngIf="isSelected(item)"
                (click)="deselect(item)"
                class="flex w-full justify-between gap-2 rounded-2xl border border-green-200 bg-green-50 px-2.5 py-1 text-sm text-green-600 dark:border-green-900 dark:bg-green-900/50"
              >
                <i class="bi bi-check-circle"></i>
                {{ 'keyword.capitalize.selected' | translate }}
              </button>
              <button
                *ngIf="isNotSelected(item)"
                (click)="select(item)"
                class="flex w-full justify-between gap-2 rounded-2xl border border-blue-200 bg-blue-50 px-2.5 py-1 text-sm text-blue-600 dark:border-blue-900 dark:bg-blue-900/50 dark:text-blue-300"
              >
                <i class="bi bi-circle"></i>
                {{ 'keyword.capitalize.select' | translate }}
              </button>

              <div class="flex flex-col items-center">
                <span class="text-end text-sm">
                  {{
                    item.durationVersions[0].prices[0].price
                      | currency
                        : item.durationVersions[0].prices[0].currency
                        : 'symbol-narrow'
                  }}
                </span>
                <span class="text-balance text-center text-sm">
                  {{
                    item.durationVersions[0].durationInSeconds
                      | humanizeDuration
                  }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </ng-container>
    </div>
    <utility-loader *ngIf="loading.isOn" />
  `,
})
export class ModalSelectServiceComponent implements OnInit {
  private readonly store = inject(Store);
  public readonly changeDetectorRef = inject(ChangeDetectorRef);
  public readonly translateService = inject(TranslateService);
  public readonly loading = new BooleanState(true);
  public readonly list$ = this.store.select(ServiceState.items).pipe(
    tap(() => {
      this.changeDetectorRef.detectChanges();
      this.loading.switchOff();
    }),
  );

  public selectedServiceList: IService[] = [];
  public newSelectedServiceList: IService[] = [];

  public multiple = true;

  public ngOnInit(): void {
    this.newSelectedServiceList = [...(this.selectedServiceList ?? [])];
  }

  public async submit(): Promise<IService[]> {
    return new Promise((resolve) => {
      resolve(this.newSelectedServiceList);
    });
  }

  public select(service: IService): void {
    if (!this.multiple) {
      if (this.newSelectedServiceList.length) {
        this.newSelectedServiceList.splice(0, 1);
      }
    }
    this.newSelectedServiceList.push(service);
    this.changeDetectorRef.detectChanges();
  }

  public deselect(service: IService): void {
    this.newSelectedServiceList = this.newSelectedServiceList.filter(
      (selectedMember: IService) => selectedMember._id !== service._id,
    );
    this.changeDetectorRef.detectChanges();
  }

  public isSelected(service: IService): boolean {
    return this.newSelectedServiceList.some(
      (selectedMember: IService) => selectedMember._id === service._id,
    );
  }

  public isNotSelected(service: IService): boolean {
    return !this.isSelected(service);
  }
}
