import {Component, inject, ViewChild, ViewEncapsulation} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CLIENT_ID} from '@src/token';
import {HeaderComponent} from '@utility/presentation/component/header/default/header.component';
import {ContainerFormComponent} from '@order/presentation/component/form/service/container.form.component';
import {StepEnum} from '@order/enum/step.enum';
import {Store} from '@ngxs/store';
import {CartActions} from '@order/state/cart/cart.actions';

@Component({
    selector: 'event-form-page',
    encapsulation: ViewEncapsulation.None,
    template: `
        <utility-header-component
            (back)="back()"
            icon="bi-x-lg"
            [title]="'keyword.capitalize.booking' | translate"
        />
        <container-form/>
    `,
    standalone: true,
    imports: [ContainerFormComponent, HeaderComponent, TranslateModule],
})
export default class Index {

    @ViewChild(ContainerFormComponent, {static: true})
    public containerFormComponent!: ContainerFormComponent;

    private readonly CLIENT_ID$ = inject(CLIENT_ID);
    private readonly router = inject(Router);
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly store = inject(Store);

    public back() {
        if (this.containerFormComponent.currentStep === StepEnum.timeSlotAndSpecialist) {
            this.store.dispatch(
                new CartActions.RemoveService(
                    this.activatedRoute.snapshot.params.serviceSessionId,
                ),
            );
        }
        if (window.history.length > 1) {
            window.history.back();
            return;
        }
        this.router.navigate(['/', this.CLIENT_ID$.value]);
    }

}
