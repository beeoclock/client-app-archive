import {Component, Input} from '@angular/core';

@Component({
  selector: 'utility-section-name-component',
  standalone: true,
  template: `
    <div class="px-3 py-4 text-[40px] font-bold uppercase">
      {{ name }}
    </div>
  `,
})
export class SectionNameComponent {
  @Input()
  public name = 'TODO';
}
