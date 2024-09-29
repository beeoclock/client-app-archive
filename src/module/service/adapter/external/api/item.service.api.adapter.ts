import {Injectable} from '@angular/core';
import * as Service from '@service/domain';
import {serviceEndpointEnum} from '@service/endpoint/service.endpoint';
import {BaseApiAdapter} from '@utility/adapter/base.api.adapter';
import {TypeGuard} from '@p4ck493/ts-type-guard';
import {is} from '@utility/checker';

@Injectable({
  providedIn: 'root',
})
export class ItemServiceApiAdapter extends BaseApiAdapter<
  Service.IService,
  [string]
> {
  @TypeGuard([is.string])
  public override execute$(id: string) {
    return this.httpClient.get<Service.IService>(serviceEndpointEnum.item, {
      headers: {
        replace: JSON.stringify({
          id,
          clientId: this.CLIENT_ID$.value,
        }),
      },
    });
  }
}
