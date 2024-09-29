import {Endpoint, EndpointCollectionType} from '@utility/domain/endpoint';
import {RequestMethodEnum} from '@utility/domain/enum/request-method.enum';
import {SourceNetworkEnum} from '@utility/domain/enum/source.network.enum';

export enum specialistEndpointEnum {
  paged = '/api/v1/client/{clientId}/specialist/paged',
  item = '/api/v1/client/{clientId}/specialist/{id}',
}

export const specialistEndpoint: EndpointCollectionType = {
  GET: {
    [specialistEndpointEnum.item]: {
      path: specialistEndpointEnum.item,
      method: RequestMethodEnum.GET,
      source: SourceNetworkEnum.client,
      replace: true,
    },
    [specialistEndpointEnum.paged]: {
      path: specialistEndpointEnum.paged,
      method: RequestMethodEnum.GET,
      source: SourceNetworkEnum.client,
      replace: true,
    },
  },
};

Endpoint.registerEndpointCollection(specialistEndpoint);
