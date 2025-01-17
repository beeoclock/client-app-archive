import {Endpoint, EndpointCollectionType} from '@utility/domain/endpoint';
import {RequestMethodEnum} from '@utility/domain/enum/request-method.enum';
import {SourceNetworkEnum} from '@utility/domain/enum/source.network.enum';

export enum mediaEndpointEnum {
  item = '/api/v1/client/{clientId}/media/{id}',
}

export const mediaEndpoint: EndpointCollectionType = {
  GET: {
    [mediaEndpointEnum.item]: {
      path: mediaEndpointEnum.item,
      method: RequestMethodEnum.GET,
      source: SourceNetworkEnum.client,
      replace: true,
      header: {
        authorization: true,
      },
    },
  },
};

Endpoint.registerEndpointCollection(mediaEndpoint);
