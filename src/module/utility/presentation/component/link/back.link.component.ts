import {Component, ElementRef, Input, ViewChild, ViewEncapsulation,} from '@angular/core';
import {RouterLink} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';

@Component({
  selector: 'utility-back-link-component',
  standalone: true,
  template: `
    <a
      [routerLink]="url"
      #link
      class="inline-flex items-center rounded-lg px-4 py-2.5 text-center text-xl font-medium text-white transition-all hover:bg-white/20 focus:outline-none focus:ring-4 focus:ring-beeColor-400"
    >
      <i class="bi bi-arrow-left"></i>
    </a>
  `,
  imports: [RouterLink, TranslateModule],
  encapsulation: ViewEncapsulation.None,
})
export class BackLinkComponent {
  @Input()
  public url: string | string[] = ['../'];

  @ViewChild('link')
  public link!: ElementRef<HTMLElement>;
}
