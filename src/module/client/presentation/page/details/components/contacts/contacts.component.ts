import {Component, Input, ViewEncapsulation} from '@angular/core';
import {NgForOf} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {IContact} from '@client/domain/interface/i.contact';

@Component({
  selector: 'contacts',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [NgForOf, TranslateModule],
  template: `
    <div
      *ngFor="let contact of contacts"
      class="flex items-center justify-between border-y border-slate-400 py-4"
    >
      <div class="flex items-center">
        <i class="bi bi-phone text-4xl"></i>
        <span class="ps-4">{{
          contact.countryCode + contact.phoneNumber
        }}</span>
      </div>
      <a
        href="tel:{{ contact.countryCode + contact.phoneNumber }}"
        class="rounded-lg bg-yellow-400 px-4 py-2 font-medium text-zinc-900"
      >
        {{ 'keyword.capitalize.call' | translate }}
      </a>
    </div>
  `,
})
export class ContactsComponent {
    @Input({required: true})
  contacts: IContact[] = [];
}
