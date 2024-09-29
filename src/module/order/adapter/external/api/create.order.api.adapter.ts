import {Injectable} from '@angular/core';
import {BaseApiAdapter} from '@utility/adapter/base.api.adapter';
import {TypeGuard} from '@p4ck493/ts-type-guard';
import {is} from '@utility/checker';
import {CreatePublicOrderDto} from '@order/domain/dto/create-public-order.dto';
import {PublicOrderDto} from '@order/domain/dto/public-order.dto';
import {orderEndpointEnum} from '@order/endpoint/event.endpoint';

@Injectable({
    providedIn: 'root',
})
export class CreateOrderApiAdapter extends BaseApiAdapter<
    PublicOrderDto,
    [CreatePublicOrderDto]
> {
    @TypeGuard([is.object])
    public override execute$(body: CreatePublicOrderDto) {
        return this.httpClient.post<PublicOrderDto>(
            orderEndpointEnum.create,
            body,
            {
                headers: {
                    replace: JSON.stringify({
                        clientId: this.CLIENT_ID$.value,
                    }),
                },
            },
        );
    }
}
