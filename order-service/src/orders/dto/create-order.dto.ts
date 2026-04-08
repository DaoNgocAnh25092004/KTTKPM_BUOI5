import {
  IsNumber,
  IsArray,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @IsNumber()
  foodId: number;

  @IsNumber()
  quantity: number;
}

export class CreateOrderDto {
  @IsNumber()
  userId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
