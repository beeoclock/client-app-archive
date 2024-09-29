import {Injectable} from '@angular/core';
import {BaseApiAdapter} from '@utility/adapter/base.api.adapter';
import {TypeGuard} from '@p4ck493/ts-type-guard';
import {is} from '@utility/checker';
import {slotEndpointEnum} from '@module/slot/endpoint/slot.endpoint';
import {BusySlotsResponseDto} from '@module/slot/domain/dto/busy-slots.response.dto';

type IBusySlotsQueryParams = {
  start: string;
  end: string;
  specialistIds?: string[];
};

@Injectable({
  providedIn: 'root',
})
export class GetBusySlotApiAdapter extends BaseApiAdapter<
  BusySlotsResponseDto[],
  [IBusySlotsQueryParams]
> {
  @TypeGuard([is.object_not_empty])
  public override execute$(params: IBusySlotsQueryParams) {
    return this.httpClient.get<BusySlotsResponseDto[]>(slotEndpointEnum.busy, {
      params: params as never,
      headers: {
        replace: JSON.stringify({
          clientId: this.CLIENT_ID$.value,
        }),
      },
    });
  }
}
