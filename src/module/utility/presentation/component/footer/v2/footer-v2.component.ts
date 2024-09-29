import {Component, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'utility-footer-v2',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  template: `
    <!-- Footer -->
    <footer class="mt-20">
      <div class="rounded-2xl bg-[#0B1828] dark:bg-gray-900">
        <div class="mx-auto w-full max-w-screen-xl lg:py-8">
          <div class="grid grid-cols-2 gap-8 px-4 py-6 md:grid-cols-4 lg:py-8">
            <div class="col-span-2 md:col-span-1">
              <h2 class="mb-6 font-semibold uppercase text-white">
                OUR MISSION
              </h2>
              <ul class="font-medium text-[#5D6E82] dark:text-gray-400">
                <li class="mb-4">
                  Bee O'clock helps professionals focus on their strengths by
                  providing services and tools, such as bookkeeping, tax
                  planning, and event management, to delegate time-consuming
                  tasks. Their mission is to empower professionals, reduce
                  stress, and increase productivity by eliminating distractions
                  and frustrations that come with running a business.
                </li>
              </ul>
            </div>
            <div class="col-span-2 md:col-span-1">
              <h2 class="mb-6 font-semibold uppercase text-white">
                FROM THE BLOG
              </h2>
              <ul class="font-medium text-[#5D6E82] dark:text-gray-400">
                <li class="mb-4">
                  <a href="#" class="hover:underline">
                    <p class="">How to start teaching online with</p>
                    <div class="flex text-sm text-[#344050]">
                      <span>Jan 15</span>
                      <i class="bi bi-dot"></i>
                      <span>8min read</span>
                    </div>
                  </a>
                </li>
                <li class="mb-4">
                  <a href="#" class="hover:underline">
                    <p class="">Grow your business with zero extra</p>
                    <div class="flex text-sm text-[#344050]">
                      <span>Jan 15</span>
                      <i class="bi bi-dot"></i>
                      <span>3min read</span>
                    </div>
                  </a>
                </li>
                <li class="mb-4">
                  <a href="#" class="hover:underline">
                    <p class="">Automate the workflow and enjoy</p>
                    <div class="flex text-sm text-[#344050]">
                      <span>Jan 15</span>
                      <i class="bi bi-dot"></i>
                      <span>3min read</span>
                    </div>
                  </a>
                </li>
                <li class="mb-4">
                  <a href="#" class="hover:underline">
                    <p class="">Connect to the globe</p>
                    <div class="flex text-sm text-[#344050]">
                      <span>Jan 15</span>
                      <i class="bi bi-dot"></i>
                      <span>3min read</span>
                    </div>
                  </a>
                </li>
              </ul>
            </div>
            <div class="col-span-2 md:col-span-1">
              <h2 class="mb-6 font-semibold uppercase text-white">
                Biz’s Features
              </h2>
              <ul class="font-medium text-[#5D6E82] dark:text-gray-400">
                <li class="mb-4">
                  <a href="#" class="hover:underline">Calendar & Appointment</a>
                </li>
                <li class="mb-4">
                  <a href="#" class="hover:underline"
                    >Customizable Online Page</a
                  >
                </li>
                <li class="mb-4">
                  <a href="#" class="hover:underline">Payments Management</a>
                </li>
                <li class="mb-4">
                  <a href="#" class="hover:underline">No-Show Protection</a>
                </li>
                <li class="mb-4">
                  <a href="#" class="hover:underline">Insights & Analytics</a>
                </li>
              </ul>
            </div>
            <div class="col-span-2 md:col-span-1">
              <h2 class="mb-6 font-semibold uppercase text-white">
                Pro’s Features
              </h2>
              <ul class="font-medium text-[#5D6E82] dark:text-gray-400">
                <li class="mb-4">
                  <a href="#" class="hover:underline"
                    >Manage Team and Resources</a
                  >
                </li>
                <li class="mb-4">
                  <a href="#" class="hover:underline">Inventory Tracking</a>
                </li>
                <li class="mb-4">
                  <a href="#" class="hover:underline">Revenue Boost</a>
                </li>
                <li class="mb-4">
                  <a href="#" class="hover:underline">Seamless Transactions</a>
                </li>
                <li class="mb-4">
                  <a href="#" class="hover:underline">Seamless Transactions</a>
                </li>
              </ul>
            </div>
          </div>
          <div
            class="flex justify-center px-4 py-6 md:items-center md:justify-between"
          >
            <a href="/" class="flex items-center text-white">
              <img
                  src="assets/logo.svg"
                class="mr-3 h-8"
                alt="Bee O\`clock Logo"
              />
              <span class="self-center whitespace-nowrap text-2xl font-bold"
                >Bee O<span class="text-beeoclock-primary">\`</span>clock</span
              >
            </a>
          </div>
        </div>
      </div>

      <div class="mt-2 flex flex-col justify-between text-sm md:flex-row">
        <div class="flex gap-4">
          <a class="text-[#2A7BE4] hover:underline" href="">Cookies</a>
          <a class="text-[#2A7BE4] hover:underline" href="">Terms of User</a>
          <a class="text-[#2A7BE4] hover:underline" href="">Privacy Policy</a>
        </div>
        <div class="flex gap-4 text-[#748194]">
          <div>© 2023 Bee O’clock All Rights Reserved</div>
          <div>v1.0.0</div>
        </div>
      </div>
    </footer>
  `,
})
export class FooterV2Component {
}
