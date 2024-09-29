import {PublicOrderServiceDto} from '@order/domain/dto/public-order-service.dto';
import {PublicOrderProductDto} from '@order/domain/dto/public-order-product.dto';
import {OrderStatusEnum} from '@order/domain/enum/order.status.enum';

export interface PublicOrderDto {
  object: 'PublicOrderDto';
  _id: string;
  products: PublicOrderProductDto[];
  services: PublicOrderServiceDto[];
  status: OrderStatusEnum;
  createdAt: string;
  updatedAt: string;
}
