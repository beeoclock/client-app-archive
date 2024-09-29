import {inject, Injectable} from '@angular/core';
import {Functions, httpsCallable, HttpsCallableResult,} from '@angular/fire/functions';
import {NotImplementedYetError} from '@utility/domain/error';

@Injectable({
  providedIn: 'root',
})
export class CloudFunctionFirebaseAdapter<ITEM> {
  protected readonly functions = inject(Functions);

  #cloudFunction:
    | {
      write: ReturnType<typeof httpsCallable>;
      read: ReturnType<typeof httpsCallable<string, ITEM>>;
      pagination: ReturnType<
          typeof httpsCallable<
              {
                  pageSize: number;
                  page: number;
                  orderBy: string;
                  orderDir: string;
                  filters: {};
              },
              {
                  items: ITEM[];
                  total: number;
              }
          >
      >;
      delete: ReturnType<typeof httpsCallable>;
  }
    | undefined;

  protected path: string | undefined;

  public initCollectionReference(path: string): void {
    if (this.path) {
      return;
    }
    this.path = path;

    this.#cloudFunction = {
      write: httpsCallable(this.functions, `${this.path}Write`),
      read: httpsCallable(this.functions, `${this.path}Read`),
      pagination: httpsCallable(this.functions, `${this.path}Pagination`),
      delete: httpsCallable(this.functions, `${this.path}Delete`),
    };
  }

  public item(id: string): Promise<HttpsCallableResult<ITEM>> {
    if (!this.#cloudFunction?.read) {
      throw new NotImplementedYetError();
    }
    return this.#cloudFunction.read(id);
  }
}
