import {Endpoint, EndpointCollectionType} from '@utility/domain/endpoint';
import {RequestMethodEnum} from '@utility/domain/enum/request-method.enum';
import {SourceNetworkEnum} from '@utility/domain/enum/source.network.enum';

export enum slotEndpointEnum {
  busy = '/api/v1/client/{clientId}/slot/busy',
}

export const slotEndpoint: EndpointCollectionType = {
  GET: {
    [slotEndpointEnum.busy]: {
      path: slotEndpointEnum.busy,
      method: RequestMethodEnum.GET,
      source: SourceNetworkEnum.client,
      replace: true,
    },
  },
};

Endpoint.registerEndpointCollection(slotEndpoint);
