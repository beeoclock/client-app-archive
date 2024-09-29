// eslint-disable-next-line @typescript-eslint/no-namespace
import {IPaymentDto} from "@module/payment/domain/interface/dto/i.payment.dto";

export namespace PaymentActions {
    export class GetItem {
        public static readonly type = '[Payment API] Get Item';

        constructor(public readonly payload: string) {
        }
    }

    export class CreateItem {
        public static readonly type = '[Payment API] Create Item';

        constructor(
            public readonly payload: {
                item: IPaymentDto
            }
        ) {
        }
    }
}
