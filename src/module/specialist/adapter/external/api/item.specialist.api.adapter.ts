import {Injectable} from '@angular/core';
import * as Specialist from '@specialist/domain';
import {BaseApiAdapter} from '@utility/adapter/base.api.adapter';
import {specialistEndpointEnum} from '@specialist/endpoint/specialist.endpoint';

@Injectable({
  providedIn: 'root',
})
export class ItemSpecialistApiAdapter extends BaseApiAdapter<Specialist.ISpecialist> {
  public override execute$(id: string) {
    return this.httpClient.get<Specialist.ISpecialist>(
      specialistEndpointEnum.item,
      {
        headers: {
          replace: JSON.stringify({
            clientId: this.CLIENT_ID$.value,
            id,
          }),
        },
      },
    );
  }
}
