import {Component, HostBinding, Input, ViewEncapsulation,} from '@angular/core';

type TextColorType =
  | 'text-secondary'
  | 'text-info'
  | 'text-primary'
  | 'text-dark'
  | 'text-danger'
  | 'text-warning'
  | 'text-light'
  | 'text-success'
  | 'text-muted'
  | 'text-body'
  | 'text-white';

@Component({
  selector: 'div[spinner]',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  template: ` <span class="sr-only"></span> `,
})
export class SpinnerComponent {
  @Input()
  public color: TextColorType = 'text-body';

  @Input()
  @HostBinding('class.spinner-border-sm')
  public sm = false;

  @HostBinding()
  public readonly role = 'status';

  @HostBinding()
  public readonly class = ['spinner-border', this.color];
}
