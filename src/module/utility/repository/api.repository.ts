import {Injectable} from '@angular/core';
import {NotImplementedYetError} from '@utility/domain/error';

@Injectable({
  providedIn: 'root',
})
export class ApiRepository<ITEM> {
  protected path: string | undefined;

  public save(value: ITEM): any {
    throw new NotImplementedYetError();
  }

  public item(id: string): any {
    throw new NotImplementedYetError();
  }

  public list(params: any): any {
    // TODO interface
    throw new NotImplementedYetError();
  }
}
