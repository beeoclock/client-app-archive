import {Component, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'utility-big-radio-input',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  template: `
    <p class="font-serif text-xl font-bold text-blue-900">Select a service</p>
    <div
      class="mt-4 grid max-w-3xl gap-x-4 gap-y-3 sm:grid-cols-2 md:grid-cols-3"
    >
      <div class="relative">
        <input
          class="peer hidden"
          id="radio_1"
          type="radio"
          name="radio"
          checked
        />
        <span
          class="absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white peer-checked:border-emerald-400"
        ></span>
        <label
          class="flex h-full cursor-pointer flex-col rounded-lg p-4 shadow-lg shadow-slate-100 peer-checked:bg-emerald-600 peer-checked:text-white"
          for="radio_1"
        >
          <span class="mt-2- font-medium">Financial Planning</span>
          <span class="text-xs uppercase">1 Hour</span>
        </label>
      </div>
      <div class="relative">
        <input class="peer hidden" id="radio_2" type="radio" name="radio" />
        <span
          class="absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white peer-checked:border-emerald-400"
        ></span>

        <label
          class="flex h-full cursor-pointer flex-col rounded-lg p-4 shadow-lg shadow-slate-100 peer-checked:bg-emerald-600 peer-checked:text-white"
          for="radio_2"
        >
          <span class="mt-2 font-medium">Retirement Planning</span>
          <span class="text-xs uppercase">1 Hour</span>
        </label>
      </div>
      <div class="relative">
        <input class="peer hidden" id="radio_3" type="radio" name="radio" />
        <span
          class="absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white peer-checked:border-emerald-400"
        ></span>

        <label
          class="flex h-full cursor-pointer flex-col rounded-lg p-4 shadow-lg shadow-slate-100 peer-checked:bg-emerald-600 peer-checked:text-white"
          for="radio_3"
        >
          <span class="mt-2 font-medium">Investment Advice</span>
          <span class="text-xs uppercase">1 Hour</span>
        </label>
      </div>
    </div>
  `,
})
export class BigRadioInputComponent {
}
