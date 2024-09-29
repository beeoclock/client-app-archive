import {Component, ViewEncapsulation} from '@angular/core';
import {FooterV2Component} from '@utility/presentation/component/footer/v2/footer-v2.component';
import {HeaderV2Component} from '@utility/presentation/component/header/v2/header-v2.component';
import {SectionNameComponent} from '@utility/presentation/component/section-name/section-name.component';
import {CarouselComponent} from '@utility/presentation/component/carousel/carousel.component';
import {BaseCardComponent} from '@utility/presentation/component/card/base-card/base-card.component';

@Component({
  selector: 'utility-specialist-details-page',
  standalone: true,
  templateUrl: 'index.html',
  imports: [
    FooterV2Component,
    HeaderV2Component,
    SectionNameComponent,
    CarouselComponent,
    BaseCardComponent,
  ],
  encapsulation: ViewEncapsulation.None,
})
export default class Index {
}
