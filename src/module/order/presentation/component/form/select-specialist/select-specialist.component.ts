import {Component, EventEmitter, HostBinding, inject, OnInit, Output, ViewEncapsulation,} from '@angular/core';
import {AsyncPipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {Store} from '@ngxs/store';
import {SpecialistState} from '@specialist/state/member/specialist.state';
import {Reactive} from '@src/module/utility/cdk/reactive';
import {map} from 'rxjs';
import {ISpecialist} from '@specialist/domain';

@Component({
    selector: 'select-specialist',
    standalone: true,
    templateUrl: 'select-specialist.component.html',
    imports: [AsyncPipe, NgForOf, NgClass, TranslateModule, NgIf, RouterLink],
    encapsulation: ViewEncapsulation.None,
})
export class SpecialistListComponent extends Reactive implements OnInit {
    @Output()
    public readonly selected = new EventEmitter<ISpecialist>();

    public readonly loadingRows = new Array(3);

    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly store = inject(Store);
    public readonly list$ = this.store.select(SpecialistState.items).pipe(
        map((items) => {
            return items.filter((item) => {
                if (!(item?.assignments?.service?.full ?? true)) {
                    return item?.assignments?.service.include.some(({service: {_id}}) => {
                        return (
                            _id === this.activatedRoute.snapshot.params.serviceSessionId
                        );
                    });
                }
                return true;
            });
        }),
    );

    public bgColorsByIndex: string[] = [];

    @HostBinding()
    public class = 'flex flex-col gap-4';

    ngOnInit() {
        this.list$.pipe(this.takeUntil()).subscribe((list) => {
            this.bgColorsByIndex = list.map(() => this.getRandomBackgroundColor());
        });
    }

    getRandomBackgroundColor(): string {
        const colors = [
            'bg-blue-300/30 text-blue-400/60',
            'bg-green-300/30 text-green-400/60',
            'bg-red-300/30 text-red-400/60',
            'bg-pink-300/30 text-pink-400/60',
            'bg-purple-300/30 text-purple-400/60',
            'bg-indigo-300/30 text-indigo-400/60',
            'bg-blue-300/30 text-blue-400/60',
            'bg-gray-300/30 text-gray-400/60',
            'bg-black text-white',
        ];
        const random = Math.floor(Math.random() * colors.length);
        return colors[random];
    }
}
