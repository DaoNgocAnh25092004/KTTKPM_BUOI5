import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Order, OrderItem, OrderStatus } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  private orders: Order[] = [];
  private idCounter = 1;

  // Thay IP thật của máy đang chạy service tương ứng trước khi demo
  private readonly FOOD_SERVICE_URL =
    process.env.FOOD_SERVICE_URL || 'http://localhost:8082';
  private readonly USER_SERVICE_URL =
    process.env.USER_SERVICE_URL || 'http://localhost:8081';

  constructor(private readonly httpService: HttpService) {}

  async create(dto: CreateOrderDto): Promise<Order> {
    // Validate user tồn tại
    let user: any;
    try {
      const res = await firstValueFrom(
        this.httpService.get(`${this.USER_SERVICE_URL}/users/${dto.userId}`),
      );
      user = res.data;
    } catch {
      throw new BadRequestException(
        `User #${dto.userId} not found or User Service unreachable`,
      );
    }

    // Lấy thông tin từng món, tính giá
    const orderItems: OrderItem[] = [];
    let totalAmount = 0;

    for (const item of dto.items) {
      let food: any;
      try {
        const res = await firstValueFrom(
          this.httpService.get(`${this.FOOD_SERVICE_URL}/foods/${item.foodId}`),
        );
        food = res.data;
      } catch {
        throw new BadRequestException(
          `Food #${item.foodId} not found or Food Service unreachable`,
        );
      }

      if (!food.available) {
        throw new BadRequestException(`Food "${food.name}" is not available`);
      }

      const subtotal = food.price * item.quantity;
      totalAmount += subtotal;

      orderItems.push({
        foodId: food.id,
        foodName: food.name,
        price: food.price,
        quantity: item.quantity,
      });
    }

    const order: Order = {
      id: this.idCounter++,
      userId: dto.userId,
      username: user.username,
      items: orderItems,
      totalAmount,
      status: OrderStatus.PENDING,
      createdAt: new Date(),
    };

    this.orders.push(order);
    console.log(
      `[Order Service] New order #${order.id} created for user "${user.username}", total: ${totalAmount.toLocaleString('vi-VN')}đ`,
    );
    return order;
  }

  findAll(): Order[] {
    return this.orders;
  }

  findOne(id: number): Order {
    const order = this.orders.find((o) => o.id === id);
    if (!order) throw new NotFoundException(`Order #${id} not found`);
    return order;
  }

  updateStatus(id: number, status: OrderStatus): Order {
    const order = this.findOne(id);
    order.status = status;
    console.log(`[Order Service] Order #${id} status updated to ${status}`);
    return order;
  }
}
