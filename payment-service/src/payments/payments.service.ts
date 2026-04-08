import { Injectable, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import {
  Payment,
  PaymentMethod,
  PaymentStatus,
} from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
  private payments: Payment[] = [];
  private idCounter = 1;

  // Thay IP thật của máy đang chạy Order Service trước khi demo
  private readonly ORDER_SERVICE_URL =
    process.env.ORDER_SERVICE_URL || 'http://localhost:8083';

  constructor(private readonly httpService: HttpService) {}

  async pay(dto: CreatePaymentDto): Promise<Payment> {
    // Kiểm tra order tồn tại
    let order: any;
    try {
      const res = await firstValueFrom(
        this.httpService.get(`${this.ORDER_SERVICE_URL}/orders/${dto.orderId}`),
      );
      order = res.data;
    } catch {
      throw new BadRequestException(
        `Order #${dto.orderId} not found or Order Service unreachable`,
      );
    }

    if (order.status === 'PAID') {
      throw new BadRequestException(`Order #${dto.orderId} is already paid`);
    }

    // Tạo payment record
    const payment: Payment = {
      id: this.idCounter++,
      orderId: dto.orderId,
      userId: dto.userId,
      method: dto.method,
      status: PaymentStatus.SUCCESS,
      createdAt: new Date(),
    };

    this.payments.push(payment);

    // Cập nhật trạng thái order → PAID
    try {
      await firstValueFrom(
        this.httpService.put(
          `${this.ORDER_SERVICE_URL}/orders/${dto.orderId}/status`,
          { status: 'PAID' },
        ),
      );
    } catch {
      console.error(`[Payment Service] Failed to update order status`);
    }

    // Gửi thông báo (console log)
    this.sendNotification(order.username, dto.orderId, payment.method);

    return payment;
  }

  private sendNotification(
    username: string,
    orderId: number,
    method: PaymentMethod,
  ): void {
    const msg = `[NOTIFICATION] ${username} đã đặt đơn #${orderId} thành công (${method})`;
    console.log('='.repeat(60));
    console.log(msg);
    console.log('='.repeat(60));
  }

  findByOrder(orderId: number): Payment | undefined {
    return this.payments.find((p) => p.orderId === orderId);
  }
}
