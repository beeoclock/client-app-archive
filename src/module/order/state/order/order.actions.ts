import {CreatePublicOrderDto} from '@order/domain/dto/create-public-order.dto';

export namespace OrderActions {
  export class GetItem {
    public static readonly type = '[Order API] Get Item';

      constructor(public readonly payload: string) {
      }
  }

  export class SetDraft {
    public static readonly type = '[Order] Set Draft';

      constructor(public readonly payload: CreatePublicOrderDto) {
      }
  }

  export class SaveOrder {
    public static readonly type = '[Order API] Save Draft';

    constructor(public readonly payload: CreatePublicOrderDto) {
    }
  }
}
