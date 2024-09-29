import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom, Observable} from 'rxjs';
import {CLIENT_ID} from '@src/token';

export const enum OrderDirEnum {
  asc = 'asc',
  desc = 'desc',
}

export const enum OrderByEnum {
  createdAt = 'createdAt', // default
  updatedAt = 'updatedAt',
}

export interface ApiQueryParamsList {
  orderBy: OrderByEnum;
  orderDir: OrderDirEnum;
  page: number;
  pageSize: number;
}

export type ResponseListType<ITEM> = {
  items: ITEM[];
  totalSize: number;
};

@Injectable({
  providedIn: 'root',
})
export abstract class BaseApiAdapter<
  RESPONSE,
  ARGUMENTS extends readonly unknown[] = [],
> {
  protected readonly CLIENT_ID$ = inject(CLIENT_ID);
  protected readonly httpClient = inject(HttpClient);

  /**
   * Stream
   */
  public abstract execute$(...args: [...ARGUMENTS]): Observable<RESPONSE>;

  /**
   * Promise
   * @param args
   */
  public executeAsync(...args: [...ARGUMENTS]): Promise<RESPONSE> {
    const executing = this.execute$(...args);
    return firstValueFrom(executing);
  }

  static initialListParams: ApiQueryParamsList = {
    orderBy: OrderByEnum.createdAt,
    orderDir: OrderDirEnum.desc,
    page: 1,
    pageSize: 100,
  };
}
