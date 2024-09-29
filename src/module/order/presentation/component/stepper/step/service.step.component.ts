import {Component, inject, ViewEncapsulation} from '@angular/core';
import {OrderFormRepository} from '@order/repository/order.form.repository';
import {IService} from '@module/service';
import {ServiceListComponent} from '@order/presentation/component/form/service/service-list/service-list.component';
import {CartActions} from '@order/state/cart/cart.actions';
import {ActivatedRoute, Router} from '@angular/router';
import {Dispatch} from '@ngxs-labs/dispatch-decorator';

@Component({
    selector: 'service-step',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [ServiceListComponent],
    template: `
        <service-list (selected)="selected($event)"/> `,
})
export class ServiceStepComponent {
    public readonly orderFormRepository = inject(OrderFormRepository);
    public readonly router = inject(Router);
    public readonly activatedRoute = inject(ActivatedRoute);

    public get form() {
        return this.orderFormRepository.form;
    }

    @Dispatch()
    public cartAddService($event: IService) {
        return new CartActions.AddService($event);
    }

    public selected($event: IService) {
        const {serviceSessionId} = this.cartAddService($event);
        this.router.navigate([serviceSessionId], {
            relativeTo: this.activatedRoute,
        });
    }
}
