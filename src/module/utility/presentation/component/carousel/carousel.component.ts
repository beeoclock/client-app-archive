import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChange,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {Carousel} from 'flowbite';
import {CarouselItem, CarouselOptions,} from 'flowbite/lib/esm/components/carousel/types';
import {NgForOf} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {RIMedia} from '@module/media/domain/interface/i.media';

@Component({
  selector: 'utility-carousel-component',
  standalone: true,
  imports: [NgForOf, TranslateModule],
  template: `
    <div #carousel class="relative w-full">
      <!-- Carousel wrapper -->
      <div class="aspect-video relative overflow-hidden sm:h-80 2xl:h-96">
        <div
          *ngFor="let image of images; let index = index"
          id="carousel-item-{{ index }}"
          class="hidden duration-700 ease-in-out"
        >
          <img
            [src]="image.url"
            class="absolute left-1/2 top-1/2 block w-full -translate-x-1/2 -translate-y-1/2"
            alt="..."
          />
        </div>
      </div>
      <!-- Slider indicators -->
      <div
        class="absolute bottom-5 left-1/2 z-30 flex -translate-x-1/2 space-x-3"
      >
        <button
          *ngFor="let image of images; let index = index"
          id="carousel-indicator-{{ index }}"
          type="button"
          class="h-3 w-3 rounded-full"
          aria-current="true"
        ></button>
      </div>
      <!-- Slider controls -->
      <button
        id="data-carousel-prev"
        type="button"
        class="group absolute left-0 top-0 z-30 flex h-full cursor-pointer items-center justify-center px-4 focus:outline-none"
      >
        <span
          class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/30 group-hover:bg-white/50 group-focus:outline-none group-focus:ring-4 group-focus:ring-white dark:bg-gray-800/30 dark:group-hover:bg-gray-800/60 dark:group-focus:ring-gray-800/70"
        >
          <svg
            class="h-4 w-4 text-white dark:text-gray-800"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 1 1 5l4 4"
            />
          </svg>
          <span class="hidden">
            {{ 'keyword.capitalize.previous' | translate }}
          </span>
        </span>
      </button>
      <button
        id="data-carousel-next"
        type="button"
        class="group absolute right-0 top-0 z-30 flex h-full cursor-pointer items-center justify-center px-4 focus:outline-none"
      >
        <span
          class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/30 group-hover:bg-white/50 group-focus:outline-none group-focus:ring-4 group-focus:ring-white dark:bg-gray-800/30 dark:group-hover:bg-gray-800/60 dark:group-focus:ring-gray-800/70"
        >
          <svg
            class="h-4 w-4 text-white dark:text-gray-800"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m1 9 4-4-4-4"
            />
          </svg>
          <span class="hidden">
            {{ 'keyword.capitalize.next' | translate }}
          </span>
        </span>
      </button>
    </div>
  `,
})
export class CarouselComponent implements AfterViewInit, OnChanges {
  @Input()
  public images: RIMedia[] = [];

  @ViewChild('carousel')
  public carousel!: ElementRef<HTMLElement>;

  public ngOnChanges(changes: SimpleChanges & { images: SimpleChange }): void {
    if (changes.images.currentValue !== changes.images.previousValue) {
      this.images = changes.images.currentValue.filter(
        (image: RIMedia) => !!image,
      );
    }
  }

  public ngAfterViewInit(): void {
    const items: CarouselItem[] = this.images.map((image, position) => ({
      position,
      el: document.getElementById('carousel-item-' + position) as HTMLElement,
    }));

    const options: CarouselOptions = {
      defaultPosition: 0,
      interval: 3000,

      indicators: {
        activeClasses: 'bg-white dark:bg-gray-800',
        inactiveClasses:
          'bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800',
        items: this.images.map((image, position) => ({
          position,
          el: document.getElementById(
            'carousel-indicator-' + position,
          ) as HTMLElement,
        })),
      },

      // callback functions
      onNext: () => {
        console.log('next slider item is shown');
      },
      onPrev: () => {
        console.log('previous slider item is shown');
      },
      onChange: () => {
        console.log('new slider item has been shown');
      },
    };

    const carousel = new Carousel(this.carousel.nativeElement, items, options);

    const $prevButton = document.getElementById('data-carousel-prev');
    const $nextButton = document.getElementById('data-carousel-next');

    if ($prevButton) {
      $prevButton.addEventListener('click', () => {
        carousel.prev();
      });
    }

    if ($nextButton) {
      $nextButton.addEventListener('click', () => {
        carousel.next();
      });
    }
  }
}
