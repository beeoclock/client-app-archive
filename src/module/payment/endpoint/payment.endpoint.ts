import {Endpoint, EndpointCollectionType} from '@utility/domain/endpoint';
import {RequestMethodEnum} from '@utility/domain/enum/request-method.enum';
import {SourceNetworkEnum} from '@utility/domain/enum/source.network.enum';

export enum paymentEndpointEnum {
  create = '/api/v1/client/{clientId}/payment',
  item = '/api/v1/client/{clientId}/payment/{id}',
  checkoutSession = '/api/v1/client/{clientId}/payment/checkout-session',
}

export const paymentEndpoint: EndpointCollectionType = {
  GET: {
    [paymentEndpointEnum.item]: {
      path: paymentEndpointEnum.item,
      method: RequestMethodEnum.GET,
      source: SourceNetworkEnum.client,
      replace: true,
    },
  },
  POST: {
    [paymentEndpointEnum.create]: {
      path: paymentEndpointEnum.create,
      method: RequestMethodEnum.POST,
      source: SourceNetworkEnum.client,
      replace: true,
    },
    [paymentEndpointEnum.checkoutSession]: {
      path: paymentEndpointEnum.checkoutSession,
      method: RequestMethodEnum.PATCH,
      source: SourceNetworkEnum.client,
      replace: true,
    },
  },
};

Endpoint.registerEndpointCollection(paymentEndpoint);
