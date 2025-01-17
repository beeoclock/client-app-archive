import {ComponentRef, Injectable, Type} from '@angular/core';
import {TypeGuard} from '@p4ck493/ts-type-guard';
import {ModalButtonInterface, ModalComponent} from './modal.component';
import {is} from '@utility/checker';
import {environment} from '@environments/environment';
import {v4} from 'uuid';
import {InjectionComponentService} from '@utility/presentation/injection-component/injection-component.service';

export type storeOfModalsType = Record<string, ComponentRef<ModalComponent>>;

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  readonly #storeOfModals: storeOfModalsType = {};

  constructor(
    private readonly injectionComponentService: InjectionComponentService,
  ) {
  }

  public get storeOfModals(): storeOfModalsType {
    return this.#storeOfModals;
  }

  //TODO: the function "createCustomTitle()" should be removed in the future
  @TypeGuard([is.string_not_empty])
  public createCustomTitle(value: string): string {
    return `<div class="subTitleBadge">
              <div class="subTitleWidth titleInline">
                ${value}
              </div>
            </div>`;
  }

  /**
   * Open, create and set new modal to scope and dom
   * @param componentList
   * @param options
   * @param id
   */
  @TypeGuard([is.array, null, null])
  public create<T>( // TODO make more than 1 T
    componentList: {
      component: Type<T>;
      data: any;
    }[],
    options: {
      modalOptions?: unknown;
      titleClasses?: string[];
      title?: string;
      id?: string;
      fixHeight?: boolean;
      showBody?: boolean;
      buttonSectionClass?: string[];
      modalSize?: unknown;
      contentHTML?: string;
      buttons?: ModalButtonInterface[];
      componentChildRefList?: ComponentRef<any>[];
    } = {},
    id: string = `${environment.config.modal.prefix}${v4()}`,
  ): Promise<ComponentRef<ModalComponent>> {
    return new Promise<ComponentRef<ModalComponent>>((resolve) => {
      const projectableNodes: any[][] = [];
      const componentRefList: any[] = [];
        componentList?.forEach(({component, data}) => {
        const componentRef: ComponentRef<T> =
          this.injectionComponentService.getComponentRefAndAssignDataAndRegisterToAppView(
            component,
            data,
          );
        componentRefList.push(componentRef);
        projectableNodes.push([componentRef.location.nativeElement]);
      });

      options = {
        ...options,
        id,
        componentChildRefList: componentRefList,
      };

      this.#storeOfModals[id] = this.injectionComponentService.appendComponent(
        ModalComponent,
        options,
        projectableNodes,
      );
      this.#storeOfModals[id].changeDetectorRef.detectChanges();
      this.#storeOfModals[id].instance.externalMethodOnCloseModalEvent = () => {
        this.close(id);
      };

      // Set modal instance in to each component children if property exist.
      this.#storeOfModals[id].instance.componentChildRefList.forEach(
        (component: ComponentRef<any>) => {
          if (Reflect.has(component.instance, 'modalInstance')) {
            component.instance.modalInstance = this.#storeOfModals[id].instance;
          }
        },
      );

      resolve(this.#storeOfModals[id]);
    });
  }

  /**
   * Close, delete and clear modal by id or all if id is empty
   * @param id
   */
  public close(id: string | null = null): void {
    if (id) {
      // Close only one selected by id modal
      this.closeModalById(id);
    } else {
      // Close all modals
      Object.keys(this.#storeOfModals ?? {}).forEach((key: string) => {
        this.closeModalById(key);
      });
    }
  }

  /**
   * Delete component from scope and html from dom
   * @param id
   * @private
   */
  @TypeGuard([is.string_not_empty])
  private deleteModalFromScope(id: string): void {
    try {
      if (is.object_not_empty(this.#storeOfModals[id])) {
        if (
          is.array_not_empty(
            this.#storeOfModals[id].instance?.componentChildRefList,
          )
        ) {
          this.#storeOfModals[id].instance.componentChildRefList.forEach(
            (componentRef: ComponentRef<any>) => {
              componentRef.destroy();
            },
          );
        }
        // this.#storeOfModals[id].instance?.modal?.dispose?.(); // TODO
        this.#storeOfModals[id].destroy();
      }
      Reflect.deleteProperty(this.#storeOfModals, id);
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Just call multi method in current class for close, delete and clear modal in scope nad dom.
   * @param id
   * @param force
   * @private
   */
  @TypeGuard([is.string_not_empty, is.boolean])
  public closeModalById(id: string, force: boolean = true): void {
    if (force) {
      this.deleteModalFromScope(id);
    } else {
      this.#storeOfModals[id].instance.closeModal();
    }
  }
}
