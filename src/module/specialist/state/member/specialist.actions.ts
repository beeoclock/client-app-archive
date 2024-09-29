// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace SpecialistActions {
  export class GetList {
    public static readonly type = '[Specialist API] Get List';
  }

  export class GetItem {
    public static readonly type = '[Specialist API] Get Item';

      constructor(public readonly payload: string) {
      }
  }
}
