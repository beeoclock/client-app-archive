import {ChangeDetectionStrategy, Component, HostBinding, inject, ViewEncapsulation,} from '@angular/core';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {BaseCardComponent} from '@utility/presentation/component/card/base-card/base-card.component';
import {TranslateModule} from '@ngx-translate/core';
import {map, Observable} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import * as Client from '@client/domain';
import {
  SpecialistListComponent
} from '@client/presentation/page/details/components/specialist-list/specialist-list.component';
import {ContactsComponent} from '@client/presentation/page/details/components/contacts/contacts.component';
import {SchedulesComponent} from '@client/presentation/page/details/components/schedules/schedules.component';
import {
  SocialNetworkLinksComponent
} from '@client/presentation/page/details/components/social-network-links/social-network-links.component';

@Component({
  selector: 'client-details',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    BaseCardComponent,
    NgForOf,
    NgIf,
    TranslateModule,
    SpecialistListComponent,
    ContactsComponent,
    SchedulesComponent,
    SocialNetworkLinksComponent,
  ],
  template: `
    <specialist-list />

    <ng-container *ngIf="contacts$ | async as contacts">
      <contacts [contacts]="contacts" />
    </ng-container>

    <ng-container *ngIf="schedules$ | async as schedules">
      <schedules [schedules]="schedules" />
    </ng-container>

    <div *ngIf="socialNetworkLink$ | async as socialNetworkLinks">
      <social-network-links [socialNetworkLinks]="socialNetworkLinks" />
    </div>
  `,
})
export class DetailsComponent {
  public readonly activatedRoute = inject(ActivatedRoute);

  public readonly item$: Observable<Client.IClient> =
      this.activatedRoute.data.pipe(map(({item}) => item));

  public readonly schedules$ = this.item$.pipe(map((item) => item.schedules));

  public readonly contacts$ = this.item$.pipe(map((item) => item.contacts));
  public readonly socialNetworkLink$ = this.item$.pipe(
    map((item) => item.socialNetworkLinks),
  );

  @HostBinding()
  public class = 'w-full flex flex-col gap-4';
}
