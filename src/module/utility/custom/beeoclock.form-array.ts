import {AbstractControl, FormArray} from '@angular/forms';
import {BeeoclockFormGroup} from '@utility/custom/beeoclock.form-group';

export class BeeoclockFormArray<
  TControl extends AbstractControl<any> = any,
> extends FormArray<TControl> {
  #countSubmitted = 0;

  public get hasBeenSubmitted(): boolean {
    return this.#countSubmitted > 0;
  }

  public get hasNotBeenSubmitted(): boolean {
    return !this.hasBeenSubmitted;
  }

  public get countSubmitted(): number {
    return this.#countSubmitted;
  }

  public submit(): void {
    this.#incrementCountSubmitted();
    this.#submitChildren();
    this.markAllAsTouched();
  }

  public resetSubmitted(): void {
    this.#countSubmitted = 0;
  }

  #incrementCountSubmitted(): void {
    this.#countSubmitted++;
  }

  #submitChildren(): void {
    if (!this.controls?.length) {
      return;
    }
    for (const control of Object.values(this.controls)) {
      if (control instanceof BeeoclockFormArray) {
        control.submit();
      }
      if (control instanceof BeeoclockFormGroup) {
        control.submit();
      }
    }
  }
}
