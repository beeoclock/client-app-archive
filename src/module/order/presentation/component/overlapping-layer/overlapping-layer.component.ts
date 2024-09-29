import {Component, Input, TemplateRef, ViewEncapsulation,} from '@angular/core';
import {NgTemplateOutlet} from '@angular/common';

@Component({
  selector: 'overlapping-layer-component',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div
      class="mx-auto w-full max-w-md flex-col items-center justify-start sm:px-4"
      id="main-container"
    >
      <ng-template
        [ngTemplateOutlet]="mainTemplateRef"
        [ngTemplateOutletContext]="mainTemplateContext"
      />
    </div>
    <div
      class="max-w-md flex-col items-center justify-start bg-gradient-to-t from-gray-800 to-slate-500 sm:px-4"
      id="hidden-container"
    >
      <ng-template
        [ngTemplateOutlet]="hiddenTemplateRef"
        [ngTemplateOutletContext]="hiddenTemplateContext"
      />
    </div>
  `,
  imports: [NgTemplateOutlet],
  styles: [
    `
      #main-container {
        transition: transform 0.3s ease;
      }

      #hidden-container {
        width: 100%;
        height: 100%;
        position: fixed;
        bottom: -100%;
        left: 50%;
        transform: translateX(-50%);
      }

      .move-to-front {
        display: flex;
      }

      .move-to-background {
        transform: scale(0.9);
      }

      @keyframes slide-up {
        0% {
          bottom: -100%;
        }
        100% {
          bottom: 0;
        }
      }

      @keyframes slide-down {
        0% {
          bottom: 0;
        }
        100% {
          bottom: -100%;
        }
      }
    `,
  ],
})
export class OverlappingLayerComponent {
    @Input({required: true})
  public mainTemplateRef!: TemplateRef<unknown>;

  public readonly mainTemplateContext = {
    open: this.showContainer.bind(this),
  };

    @Input({required: true})
  public hiddenTemplateRef!: TemplateRef<unknown>;

  public readonly hiddenTemplateContext = {
    close: this.hideContainer.bind(this),
  };

  showContainer() {
    const mainContainer = document.getElementById('main-container');
    const hiddenContainer = document.getElementById('hidden-container');

    if (!mainContainer || !hiddenContainer) {
      return;
    }

    mainContainer.classList.add('move-to-background');
    hiddenContainer.classList.add('move-to-front');
    hiddenContainer.style.animation = 'slide-up 0.3s ease forwards';
  }

  hideContainer() {
    const mainContainer = document.getElementById('main-container');
    const hiddenContainer = document.getElementById('hidden-container');

    if (!mainContainer || !hiddenContainer) {
      return;
    }

    mainContainer.classList.remove('move-to-background');
    hiddenContainer.style.animation = 'slide-down 0.3s ease forwards';
    hiddenContainer.addEventListener(
      'animationend',
      () => {
        hiddenContainer.classList.remove('move-to-front');
      },
        {once: true},
    );
  }
}
