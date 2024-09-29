import {FormControl, Validators} from '@angular/forms';
import ObjectID from 'bson-objectid';
import {AttendantDto} from '@order/domain/dto/create-public-order.dto';
import {BeeoclockFormGroup} from '@utility/custom/beeoclock.form-group';
import {BeeoclockFormArray} from '@utility/custom/beeoclock.form-array';

export interface IAttendeeForm {
    _id: FormControl<string>;
    firstName: FormControl<string>;
    lastName: FormControl<string>;
    phone: FormControl<string>;
    email: FormControl<string>;
}

export class AttendantForm extends BeeoclockFormGroup<IAttendeeForm> {
    constructor(initialValue: Partial<AttendantDto> = {}) {
        super({
            _id: new FormControl(ObjectID().toHexString(), {
                nonNullable: true,
            }),
            firstName: new FormControl('', {
                nonNullable: true,
            }),
            lastName: new FormControl('', {
                nonNullable: true,
            }),
            phone: new FormControl('', {
                nonNullable: true,
            }),
            email: new FormControl('', {
                nonNullable: true,
                validators: [Validators.email],
            }),
        });
        this.patchValue(initialValue);
    }
}

export class AttendeesFormArray extends BeeoclockFormArray<AttendantForm> {
    public pushNewOne(initialValue: Partial<AttendantDto> = {}): void {
        this.push(new AttendantForm(initialValue));
    }
}
