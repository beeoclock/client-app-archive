import {Injectable} from '@angular/core';
import * as Client from '@client/domain';
import {clientEndpointEnum} from '@client/endpoint/client.endpoint';
import {BaseApiAdapter} from '@utility/adapter/base.api.adapter';

type IResponse = {
  items: Client.IClient[];
  totalSize: number;
};

@Injectable({
  providedIn: 'root',
})
export class ListClientApiAdapter extends BaseApiAdapter<IResponse> {
  public override execute$(params: any) {
    return this.httpClient.get<IResponse>(clientEndpointEnum.paged, {
      params,
    });
  }
}
