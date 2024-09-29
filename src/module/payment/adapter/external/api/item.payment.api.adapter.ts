import {Injectable} from '@angular/core';
import {BaseApiAdapter} from '@utility/adapter/base.api.adapter';
import {TypeGuard} from '@p4ck493/ts-type-guard';
import {is} from '@utility/checker';
import {paymentEndpointEnum} from '@module/payment/endpoint/payment.endpoint';
import {IPaymentDto} from "@module/payment/domain/interface/dto/i.payment.dto";

@Injectable({
    providedIn: 'root',
})
export class ItemPaymentApiAdapter extends BaseApiAdapter<
    IPaymentDto,
    [string]
> {
    @TypeGuard([is.string])
    public override execute$(id: string) {
        return this.httpClient.get<IPaymentDto>(paymentEndpointEnum.item, {
            headers: {
                replace: JSON.stringify({
                    clientId: this.CLIENT_ID$.value,
                    id,
                }),
            },
        });
    }
}
