import {Component, ViewEncapsulation} from '@angular/core';
import {LogoComponent} from '@src/module/utility/presentation/component/logo/logo.component';

@Component({
  selector: 'utility-footer-v1-component',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [LogoComponent],
  templateUrl: 'footer-v1.component.html',
})
export class FooterV1Component {
}
