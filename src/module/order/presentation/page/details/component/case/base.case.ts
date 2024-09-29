import {Directive, Input} from "@angular/core";
import {PublicOrderDto} from "@order/domain/dto/public-order.dto";
import {OrderStatusEnum} from "@order/domain/enum/order.status.enum";

@Directive()
export abstract class BaseCaseComponent {
  @Input({required: true})
  item!: PublicOrderDto;

  public readonly status = OrderStatusEnum;

}
