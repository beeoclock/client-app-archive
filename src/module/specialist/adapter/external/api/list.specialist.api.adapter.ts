import {Injectable} from '@angular/core';
import * as Specialist from '@specialist/domain';
import {ApiQueryParamsList, BaseApiAdapter,} from '@utility/adapter/base.api.adapter';
import {IListResponse} from '@utility/domain/interface/i.list.response';
import {specialistEndpointEnum} from '@specialist/endpoint/specialist.endpoint';

@Injectable({
  providedIn: 'root',
})
export class ListSpecialistApiAdapter extends BaseApiAdapter<
  IListResponse<Specialist.ISpecialist>
> {
  public override execute$(
    params: ApiQueryParamsList = BaseApiAdapter.initialListParams,
  ) {
    return this.httpClient.get<IListResponse<Specialist.ISpecialist>>(
      specialistEndpointEnum.paged,
      {
        params: params as any,
        headers: {
          replace: JSON.stringify({
            clientId: this.CLIENT_ID$.value,
          }),
        },
      },
    );
  }
}
