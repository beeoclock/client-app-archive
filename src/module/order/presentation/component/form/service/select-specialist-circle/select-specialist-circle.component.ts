import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    HostBinding,
    inject,
    Input,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import {BehaviorSubject, map, tap} from 'rxjs';
import {AsyncPipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {ISpecialist} from '@specialist/domain';
import {BooleanStreamState} from '@utility/domain/boolean-stream.state';
import {Store} from '@ngxs/store';
import {SpecialistState} from '@specialist/state/member/specialist.state';
import {FormControl} from '@angular/forms';
import {CompositorLocalService} from '@order/presentation/component/stepper/step/providers/compositor.local.service';

@Component({
    selector: 'select-specialist-circle',
    standalone: true,
    templateUrl: 'select-specialist-circle.component.html',
    imports: [AsyncPipe, NgForOf, NgClass, TranslateModule, NgIf],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectSpecialistCircleComponent implements OnInit {
    @Input()
    public assignedToServiceId: string | null = null;

    @Input()
    public control = new FormControl<string | null>(null);

    public readonly loadingRows = new Array(3);

    public readonly loading = new BooleanStreamState(true);

    private readonly compositorLocalService = inject(CompositorLocalService);
    private readonly changeDetectorRef = inject(ChangeDetectorRef);
    private readonly store = inject(Store);
    public readonly list$ = new BehaviorSubject<ISpecialist[]>([]);

    public bgColorsByIndex: string[] = [];

    @HostBinding()
    public class = 'flex flex-col gap-4';

    ngOnInit() {
        this.list$.subscribe((list) => {
            this.bgColorsByIndex = list.map(() => this.getRandomBackgroundColor());
            this.changeDetectorRef.detectChanges();
        });
        this.store
            .select(SpecialistState.items)
            .pipe(
                map((specialists) => {
                    if (this.assignedToServiceId) {
                        return specialists.filter((specialist) => {
                            if (!specialist.assignments?.service) {
                                return false;
                            }
                            if (specialist?.assignments?.service?.full) {
                                return true;
                            }
                            return specialist.assignments?.service.include.some(
                                ({service: {_id}}) => {
                                    return _id === this.assignedToServiceId;
                                },
                            );
                        });
                    }
                    return specialists;
                }),
                tap(() => {
                    this.loading.switchOff();
                }),
            )
            .subscribe(this.list$);
    }

    public isSelected(id: string | null): boolean {
        return this.control.value === id;
    }

    public isNotSelected(id: string | null): boolean {
        return !this.isSelected(id);
    }

    public select(id: string | null): void {
        this.control.setValue(id);
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
