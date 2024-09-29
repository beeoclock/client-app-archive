import {Endpoint, EndpointCollectionType} from '@utility/domain/endpoint';
import {RequestMethodEnum} from '@utility/domain/enum/request-method.enum';
import {SourceNetworkEnum} from '@utility/domain/enum/source.network.enum';

export enum serviceEndpointEnum {
  paged = '/api/v1/client/{clientId}/service/paged',
  item = '/api/v1/client/{clientId}/service/{id}',
}

export const serviceEndpoint: EndpointCollectionType = {
  GET: {
    [serviceEndpointEnum.item]: {
      path: serviceEndpointEnum.item,
      method: RequestMethodEnum.GET,
      source: SourceNetworkEnum.client,
      replace: true,
    },
    [serviceEndpointEnum.paged]: {
      path: serviceEndpointEnum.paged,
      method: RequestMethodEnum.GET,
      source: SourceNetworkEnum.client,
      replace: true,
    },
  },
};

Endpoint.registerEndpointCollection(serviceEndpoint);
