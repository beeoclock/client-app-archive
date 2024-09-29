import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  inject,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import {DurationVersionHtmlHelper} from '@utility/helper/duration-version.html.helper';
import {combineLatest, map, Observable, startWith, tap} from 'rxjs';
import {AsyncPipe, CurrencyPipe, NgForOf, NgIf} from '@angular/common';
import {LoaderComponent} from '@utility/presentation/component/loader/loader.component';
import {TranslateService} from '@ngx-translate/core';
import {RouterLink} from '@angular/router';
import {Select, Store} from '@ngxs/store';
import {ServiceState} from '@service/state/service/service.state';
import {ItemOnListComponent} from '@specialist/presentation/component/item/item-on-list.component';
import {ClientState} from '@client/state/client/client.state';
import {LanguageCodeEnum} from '@utility/domain/enum';
import {IService} from '@module/service';
import {NGXLogger} from 'ngx-logger';

@Component({
  selector: 'service-list',
  standalone: true,
  templateUrl: './service-list.component.html',
  imports: [
    AsyncPipe,
    NgForOf,
    NgIf,
    LoaderComponent,
    RouterLink,
    ItemOnListComponent,
  ],
  providers: [CurrencyPipe, DurationVersionHtmlHelper],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceListComponent implements OnInit {
  @Output()
  public readonly selected = new EventEmitter<IService>();

  public readonly loadingRows = new Array(10);

  public readonly translateService = inject(TranslateService);
  public readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly store = inject(Store);
  private readonly ngxLogger = inject(NGXLogger);

  @Select(ClientState.availableLanguages)
  public availableLanguages$!: Observable<LanguageCodeEnum[]>;

  public readonly list$ = combineLatest([
    this.store.select(ServiceState.items),
    this.translateService.onLangChange.pipe(
        startWith({lang: this.translateService.currentLang}),
    ),
  ]).pipe(
    map(([items, currentLanguage]) => {
      return items
        .filter((item) => {
          if (!item.languageVersions?.length) {
            return false;
          }
          return item.languageVersions.some((languageVersion) => {
            if (!languageVersion.language) {
              return false;
            }
            return currentLanguage.lang === languageVersion.language;
          });
        })
        .map((item) => {
          return {
            ...item,
            languageVersions: item.languageVersions.filter(
              (languageVersion) => {
                if (!languageVersion.language) {
                  return false;
                }
                return currentLanguage.lang === languageVersion.language;
              },
            ),
          };
        });
    }),
    tap(() => {
      this.changeDetectorRef.detectChanges();
    }),
  );

  @HostBinding()
  public class = 'w-full flex-col justify-start items-center gap-4 flex';

  ngOnInit() {
    this.translateService.onLangChange.subscribe(() => {
      this.changeDetectorRef.detectChanges();
    });
  }

  public select(service: IService) {
    this.ngxLogger.debug('ServiceListComponent.select', service);
    this.selected.emit(service);
  }
}
