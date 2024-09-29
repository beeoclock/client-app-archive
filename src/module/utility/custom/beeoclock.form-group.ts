import {AbstractControl, FormGroup} from '@angular/forms';
import {BeeoclockFormArray} from '@utility/custom/beeoclock.form-array';

export class BeeoclockFormGroup<
  TControl extends { [K in keyof TControl]: AbstractControl<any> } = any,
> extends FormGroup<TControl> {
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
