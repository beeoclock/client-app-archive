import {Injectable} from '@angular/core';
import {BaseApiAdapter} from '@utility/adapter/base.api.adapter';
import {TypeGuard} from '@p4ck493/ts-type-guard';
import {is} from '@utility/checker';
import {orderEndpointEnum} from '@order/endpoint/event.endpoint';

@Injectable({
  providedIn: 'root',
})
export class CancelOrderApiAdapter extends BaseApiAdapter<void, [string]> {
  @TypeGuard([is.string_not_empty])
  public override execute$(id: string) {
    return this.httpClient.patch<void>(orderEndpointEnum.cancel, null, {
      headers: {
        replace: JSON.stringify({
          clientId: this.CLIENT_ID$.value,
          id,
        }),
      },
    });
  }
}
