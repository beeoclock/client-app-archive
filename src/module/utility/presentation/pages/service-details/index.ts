import {Component, ViewEncapsulation} from '@angular/core';
import {FooterV2Component} from '@utility/presentation/component/footer/v2/footer-v2.component';

@Component({
  selector: 'utility-service-details-page',
  standalone: true,
  templateUrl: 'index.html',
    imports: [FooterV2Component],
  encapsulation: ViewEncapsulation.None,
})
export default class Index {
}
