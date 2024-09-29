import {Component, Input, ViewEncapsulation} from '@angular/core';
import {FormTextareaComponent} from '@utility/presentation/component/input/form.textarea.component';
import {FormControl} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';

@Component({
  selector: 'event-note',
  template: `
    <form-textarea-component
      [placeholder]="
        'event.form.section.general.comment.placeholder' | translate
      "
      [label]="'keyword.capitalize.comment' | translate"
      [control]="control"
    />
  `,
  encapsulation: ViewEncapsulation.None,
  imports: [FormTextareaComponent, TranslateModule],
  standalone: true,
})
export class NoteComponent {
  @Input()
  public control!: FormControl<string>;
}
