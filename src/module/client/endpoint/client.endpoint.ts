import {Endpoint, EndpointCollectionType} from '@utility/domain/endpoint';
import {RequestMethodEnum} from '@utility/domain/enum/request-method.enum';
import {SourceNetworkEnum} from '@utility/domain/enum/source.network.enum';

export enum clientEndpointEnum {
  paged = '/api/v1/client/paged',
  item = '/api/v1/client/{id}',
}

export const clientEndpoint: EndpointCollectionType = {
  GET: {
    [clientEndpointEnum.item]: {
      path: clientEndpointEnum.item,
      method: RequestMethodEnum.GET,
      source: SourceNetworkEnum.client,
      replace: true,
    },
    [clientEndpointEnum.paged]: {
      path: clientEndpointEnum.paged,
      method: RequestMethodEnum.GET,
      source: SourceNetworkEnum.client,
    },
  },
};

Endpoint.registerEndpointCollection(clientEndpoint);
