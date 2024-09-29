import {Injectable} from '@angular/core';
import * as Client from '@client/domain';
import {clientEndpointEnum} from '@client/endpoint/client.endpoint';
import {BaseApiAdapter} from '@utility/adapter/base.api.adapter';

@Injectable({
  providedIn: 'root',
})
export class ItemClientApiAdapter extends BaseApiAdapter<
  Client.IClient,
  [string]
> {
  /**
   * GET ITEM BY ID
   * @param id
   */
  public override execute$(id: string) {
    return this.httpClient.get<Client.IClient>(clientEndpointEnum.item, {
      headers: {
        replace: JSON.stringify({
          id,
        }),
      },
    });
  }
}
