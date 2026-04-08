import { IsNumber, IsEnum } from 'class-validator';
import { PaymentMethod } from '../entities/payment.entity';

export class CreatePaymentDto {
  @IsNumber()
  orderId: number;

  @IsNumber()
  userId: number;

  @IsEnum(PaymentMethod)
  method: PaymentMethod;
}
