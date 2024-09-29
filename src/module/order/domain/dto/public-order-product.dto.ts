import {ActiveEnum} from '@utility/domain/enum';

export interface MediaDto {
  object: 'MediaDto';
  _id: string;
  url: string;
}

export interface PublicProductDto {
  object: 'PublicProductDto';
  _id: string;
  name: string;
  productCode: string;
  description: string;
  price: number;
  isActive: ActiveEnum;
  tags: string[];
  images: MediaDto[];
  discountRate: number;
  createdAt: string;
  updatedAt: string;
}

export interface PublicOrderProductDto {
  object: 'PublicOrderProductDto';
  _id: string;
  quantity: number;
  orderServiceId: string;
  productSnapshot: PublicProductDto;
}
