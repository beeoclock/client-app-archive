import {Injectable} from '@angular/core';
import {BaseApiAdapter} from '@utility/adapter/base.api.adapter';
import {TypeGuard} from '@p4ck493/ts-type-guard';
import {is} from '@utility/checker';
import {paymentEndpointEnum} from '@module/payment/endpoint/payment.endpoint';
import {IPaymentDto} from "@module/payment/domain/interface/dto/i.payment.dto";

@Injectable({
    providedIn: 'root',
})
export class CreatePaymentApiAdapter extends BaseApiAdapter<
    IPaymentDto,
    [IPaymentDto]
> {
    @TypeGuard([is.object])
    public override execute$(body: IPaymentDto) {
        return this.httpClient.post<IPaymentDto>(paymentEndpointEnum.create, body, {
            headers: {
                replace: JSON.stringify({
                    clientId: this.CLIENT_ID$.value,
                }),
            },
        });
    }
}
