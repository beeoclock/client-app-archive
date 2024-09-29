import {Component, ViewEncapsulation} from '@angular/core';
import {FooterV1Component} from '@utility/presentation/component/footer/v1/footer-v1.component';

@Component({
  selector: 'utility-inactive-details-page',
  standalone: true,
  template: `
    <div class="flex h-screen flex-col items-center justify-center px-4">
      <h1 class="mb-4 text-4xl font-bold text-gray-800">
        Sorry, the selected page is inactive
      </h1>
      <div class="flex space-x-4">
        <a
          href="/"
          class="rounded-full bg-blue-500 px-4 py-2 text-white transition duration-300 hover:bg-blue-600"
        >
          Go to main page
        </a>
      </div>
    </div>
  `,
  imports: [FooterV1Component],
  encapsulation: ViewEncapsulation.None,
})
export default class Index {
}
