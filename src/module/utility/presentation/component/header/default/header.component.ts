import {Component, EventEmitter, HostBinding, Input, Output, ViewEncapsulation,} from '@angular/core';
import {ChangeLanguageComponent} from '@utility/presentation/component/change-language/change-language.component';

@Component({
  selector: 'utility-header-component',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [ChangeLanguageComponent],
  templateUrl: 'header.component.html',
})
export class HeaderComponent {
  @Input({required: true})
  public title!: string;

  @Input()
  public icon: string = 'bi-arrow-left';

  @Output()
  public readonly back = new EventEmitter<MouseEvent>();

  @HostBinding()
  public class = 'w-full';
}
