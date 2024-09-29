import {Component, inject, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {FooterV1Component} from '@utility/presentation/component/footer/v1/footer-v1.component';

@Component({
  selector: 'utility-service-details-page',
  standalone: true,
  template: ` Redirect... `,
  imports: [FooterV1Component],
  encapsulation: ViewEncapsulation.None,
})
export default class Index implements OnInit {
  public readonly activatedRoute = inject(ActivatedRoute);

  public ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(
      (result: Params & { to?: string }) => {
        if (result?.to) {
          window.location.replace(result.to);
        }
      },
    );
  }
}
