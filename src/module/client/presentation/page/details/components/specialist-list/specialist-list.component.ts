import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  inject,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import {BehaviorSubject, tap} from 'rxjs';
import {AsyncPipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {ISpecialist} from '@specialist/domain';
import {BooleanStreamState} from '@utility/domain/boolean-stream.state';
import {Store} from '@ngxs/store';
import {SpecialistState} from '@specialist/state/member/specialist.state';

@Component({
  selector: 'specialist-list',
  standalone: true,
  templateUrl: 'specialist-list.component.html',
  imports: [AsyncPipe, NgForOf, NgClass, TranslateModule, NgIf],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpecialistListComponent implements OnInit {
  public readonly loadingRows = new Array(3);

  public readonly loading = new BooleanStreamState(true);

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
      .pipe(tap(() => this.loading.switchOff()))
      .subscribe(this.list$);
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
