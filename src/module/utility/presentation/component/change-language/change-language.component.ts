import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    HostBinding,
    inject,
    Input,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {DropdownComponent} from '@utility/presentation/component/dropdown/dropdown.component';
import {LanguageCodeEnum, LanguageRecord, LANGUAGES,} from '@utility/domain/enum';
import {AsyncPipe, NgForOf} from '@angular/common';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {Dropdown, DropdownInterface, DropdownOptions} from 'flowbite';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {ClientState} from '@client/state/client/client.state';
import {Select} from '@ngxs/store';
import {map, Observable} from 'rxjs';
import {Reactive} from '@utility/cdk/reactive';
import {is} from '@utility/checker';
import {toSignal} from '@angular/core/rxjs-interop';
import {NGXLogger} from 'ngx-logger';
import {WINDOW} from '@src/token';

@Component({
  selector: 'utility-change-language-component',
  standalone: true,
  template: `
    <!--  Dropdown button  -->
    <button
      #dropdownButton
      class="inline-flex items-center rounded-lg px-4 py-2.5 text-center text-xl font-medium text-white transition-all duration-100 hover:bg-white/20 focus:outline-none focus:ring-4 focus:ring-beeColor-400 active:scale-95"
      [attr.aria-label]="'keyword.capitalize.changeLanguage' | translate"
      type="button"
    >
      <i class="bi bi-translate"></i>
      <!--      <span class="ms-2">-->
      <!--        {{ selectedLanguageLabel }}-->
      <!--      </span>-->
    </button>

    <!-- Dropdown menu -->
    <div
      #dropdownMenu
      class="z-10 hidden w-44 divide-y divide-beeColor-100 rounded-lg bg-white shadow dark:bg-beeDarkColor-700"
    >
      <form [formGroup]="form">
        <ul
          class="space-y-1 p-3 text-sm text-beeColor-700 dark:text-beeDarkColor-200"
          aria-labelledby="dropdownDefaultButton"
        >
          <li *ngFor="let language of languages">
            <label
              [for]="'language-' + language.code"
              class="w-fulltext-sm flex cursor-pointer items-center gap-3 rounded p-2 font-medium text-beeColor-900 hover:bg-beeColor-100 dark:text-beeDarkColor-300 dark:hover:bg-beeDarkColor-600"
            >
              <input
                [id]="'language-' + language.code"
                type="radio"
                [value]="language.code"
                formControlName="language"
                class="h-4 w-4 cursor-pointer border-beeColor-300 bg-beeColor-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-beeDarkColor-500 dark:bg-beeDarkColor-600 dark:ring-offset-beeDarkColor-800 dark:focus:ring-blue-600 dark:focus:ring-offset-beeDarkColor-800"
              />
              {{ language.name }}
            </label>
          </li>
        </ul>
      </form>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    DropdownComponent,
    NgForOf,
    ReactiveFormsModule,
    AsyncPipe,
    TranslateModule,
  ],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.hidden]': 'hiddenClass()',
  },
})
export class ChangeLanguageComponent
  extends Reactive
    implements OnInit, AfterViewInit {
  @ViewChild('dropdownButton')
  public dropdownButton!: ElementRef<HTMLButtonElement>;

  @ViewChild('dropdownMenu')
  public dropdownMenu!: ElementRef<HTMLDivElement>;

  @Input()
  @HostBinding()
  public id = 'utility-popover-btn';

  // The popover will present only on mobile size
  @Input()
  @HostBinding('class.sm:hidden')
  public smHidden = false;

  @Select(ClientState.availableLanguages)
  public availableLanguages$!: Observable<LanguageCodeEnum[]>;

  public readonly hiddenClass = toSignal(
    this.availableLanguages$.pipe(map(is.len_lte_1)),
      {initialValue: true},
  );

  public languages = LANGUAGES;

  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly translateService = inject(TranslateService);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly ngxLogger = inject(NGXLogger);
  private readonly window = inject(WINDOW);

  public readonly form = new FormGroup({
    language: new FormControl<LanguageCodeEnum>(LANGUAGES[0].code),
  });

  public get selectedLanguageLabel(): string {
    if (this.form.controls.language.value) {
      return LanguageRecord[this.form.controls.language.value];
    }
    return 'Not selected';
  }

  #dropdown: DropdownInterface | undefined;

  public get dropdown(): DropdownInterface | undefined {
    return this.#dropdown;
  }

  public ngOnInit(): void {
    this.form.controls.language.setValue(this.currentLanguage);
  }

  public ngAfterViewInit(): void {
    // options with default values
    const options: DropdownOptions = {
      placement: 'bottom-start',
      triggerType: 'click',
    };

    /*
     * targetEl: required
     * triggerEl: required
     * options: optional
     */
    this.#dropdown = new Dropdown(
      this.dropdownMenu.nativeElement,
      this.dropdownButton.nativeElement,
      options,
    );

    // Handle change language
    this.form.controls.language.valueChanges
      .pipe(this.takeUntil())
      .subscribe((languageCode: LanguageCodeEnum | null) => {
        if (languageCode) {
          this.translateService.use(languageCode);
          this.updateUrlLanguage(languageCode);
        }
      });

    this.availableLanguages$
      .pipe(this.takeUntil())
      .subscribe((availableLanguages) => {
        this.languages = LANGUAGES.filter((language) =>
          availableLanguages.includes(language.code),
        );

        if (
          !availableLanguages.includes(
            this.translateService.currentLang as LanguageCodeEnum,
          )
        ) {
          this.form.controls.language.setValue(this.languages[0].code);
        }
        this.changeDetectorRef.detectChanges();
      });
  }

  private get currentLanguage(): LanguageCodeEnum {
    const {language} = this.activatedRoute.snapshot.params;
    return language ?? (this.translateService.currentLang as LanguageCodeEnum);
  }

  private updateUrlLanguage(languageCode: LanguageCodeEnum): void {
    const {language} = this.activatedRoute.snapshot.params;
    const urlObject = new URL(this.window.location.href);
    // @ts-ignore
    let queryParams = {};
    // @ts-ignore
    if (urlObject.searchParams.size) {
      // @ts-ignore
      queryParams = Object.fromEntries(urlObject.searchParams.entries());
    }

    let url = urlObject.pathname.split('/').slice(1);
    if (language) {
      url[0] = languageCode;
    } else {
      url.unshift(languageCode);
    }
    this.ngxLogger.info('url', url);
    this.router
      .navigate(url, {
        queryParams,
        fragment: this.activatedRoute.snapshot.fragment ?? undefined,
        queryParamsHandling: 'merge',
      })
      .then(() => {
        this.ngxLogger.info('Navigate to', this.router.url);
      });
  }
}
