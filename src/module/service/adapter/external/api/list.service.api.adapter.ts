import {Injectable} from '@angular/core';
import * as Service from '@service/domain';
import {serviceEndpointEnum} from '@service/endpoint/service.endpoint';
import {ApiQueryParamsList, BaseApiAdapter,} from '@utility/adapter/base.api.adapter';
import {IListResponse} from '@utility/domain/interface/i.list.response';

@Injectable({
  providedIn: 'root',
})
export class ListServiceApiAdapter extends BaseApiAdapter<
  IListResponse<Service.IService>
> {
  public override execute$(
    params: ApiQueryParamsList = BaseApiAdapter.initialListParams,
  ) {
    return this.httpClient.get<IListResponse<Service.IService>>(
      serviceEndpointEnum.paged,
      {
        headers: {
          replace: JSON.stringify({
            clientId: this.CLIENT_ID$.value,
          }),
        },
        params: {
          ...params,
          orderBy: 'order',
          orderDir: 'asc',
        } as any,
      },
    );
  }
}
