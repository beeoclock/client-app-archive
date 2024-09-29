// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ClientActions {
  export class GetList {
    public static readonly type = '[Client API] Get List';
  }

  export class GetItem {
    public static readonly type = '[Client API] Get Item';

      constructor(public readonly payload: string) {
      }
  }
}
