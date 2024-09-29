import {IService} from '@module/service';
import {SpecialistModeEnum} from '@order/enum/specialist-mode.enum';
import ObjectID from 'bson-objectid';

export namespace CartActions {

    export class Clear {
        static readonly type = '[Cart] Clear';
    }

    export class AddService {
        static readonly type = '[Cart] Add Service';
        public readonly serviceSessionId = new ObjectID().toHexString();

        constructor(public readonly service: IService) {
        }
    }

    export class UpdateSlot {
        static readonly type = '[Cart] Update Slot';

        constructor(
            public readonly payload: {
                serviceSessionId: string;
                slot: {
                    start: string;
                    end: string;
                    specialistIds: string[];
                };
            },
        ) {
        }
    }

    export class UpdateSpecialist {
        static readonly type = '[Cart] Update Specialist';

        constructor(
            public readonly payload: {
                serviceSessionId: string;
                specialistId: string | null;
                specialistMode: SpecialistModeEnum;
            },
        ) {
        }
    }

    export class RemoveService {
        static readonly type = '[Cart] Remove Service';

        constructor(public readonly serviceSessionId: string) {
        }
    }

    export class SetCustomerInfo {
        static readonly type = '[Cart] Set Customer Info';

        constructor(
            public readonly firstName: string | undefined,
            public readonly phone: string | undefined,
            public readonly email: string | undefined,
        ) {
        }
    }

    export class SetNote {
        static readonly type = '[Cart] Set General Comment';

        constructor(public readonly comment: string) {
        }
    }
}
