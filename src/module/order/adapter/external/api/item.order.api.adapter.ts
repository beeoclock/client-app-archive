import {Injectable} from '@angular/core';
import {BaseApiAdapter} from '@utility/adapter/base.api.adapter';
import {TypeGuard} from '@p4ck493/ts-type-guard';
import {is} from '@utility/checker';
import {PublicOrderDto} from '@order/domain/dto/public-order.dto';
import {orderEndpointEnum} from '@order/endpoint/event.endpoint';

@Injectable({
  providedIn: 'root',
})
export class ItemOrderApiAdapter extends BaseApiAdapter<
  PublicOrderDto,
  [string]
> {
  @TypeGuard([is.string])
  public override execute$(id: string) {
    return this.httpClient.get<PublicOrderDto>(orderEndpointEnum.item, {
      headers: {
        replace: JSON.stringify({
          clientId: this.CLIENT_ID$.value,
          id,
        }),
      },
    });
  }
}
