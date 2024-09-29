import {Endpoint, EndpointCollectionType} from '@utility/domain/endpoint';
import {RequestMethodEnum} from '@utility/domain/enum/request-method.enum';
import {SourceNetworkEnum} from '@utility/domain/enum/source.network.enum';

export enum orderEndpointEnum {
  create = '/api/v1/client/{clientId}/order',
  cancel = '/api/v1/client/{clientId}/order/{id}/cancel',
  item = '/api/v1/client/{clientId}/order/{id}',
  busySlots = '/api/v1/client/{clientId}/order/busy-slots',
}

export const orderEndpoint: EndpointCollectionType = {
  GET: {
    [orderEndpointEnum.busySlots]: {
      path: orderEndpointEnum.busySlots,
      method: RequestMethodEnum.GET,
      source: SourceNetworkEnum.client,
      replace: true,
    },
    [orderEndpointEnum.item]: {
      path: orderEndpointEnum.item,
      method: RequestMethodEnum.GET,
      source: SourceNetworkEnum.client,
      replace: true,
    },
  },
  POST: {
    [orderEndpointEnum.create]: {
      path: orderEndpointEnum.create,
      method: RequestMethodEnum.POST,
      source: SourceNetworkEnum.client,
      replace: true,
    },
  },
  PATCH: {
    [orderEndpointEnum.cancel]: {
      path: orderEndpointEnum.cancel,
      method: RequestMethodEnum.PATCH,
      source: SourceNetworkEnum.client,
      replace: true,
    },
  },
};

Endpoint.registerEndpointCollection(orderEndpoint);
