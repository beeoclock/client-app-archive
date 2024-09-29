import {Injectable} from '@angular/core';
import {BaseApiAdapter} from '@utility/adapter/base.api.adapter';
import {TypeGuard} from '@p4ck493/ts-type-guard';
import {is} from '@utility/checker';
import {paymentEndpointEnum} from '@module/payment/endpoint/payment.endpoint';

@Injectable({
  providedIn: 'root',
})
export class CheckoutSessionPaymentApiAdapter extends BaseApiAdapter<
  unknown,
  [string]
> {
  @TypeGuard([is.string_not_empty])
  public override execute$(eventId: string) {
    return this.httpClient.post<unknown>(
      paymentEndpointEnum.checkoutSession,
      null,
      {
        headers: {
          replace: JSON.stringify({
            clientId: this.CLIENT_ID$.value,
            eventId,
          }),
        },
      },
    );
  }
}
