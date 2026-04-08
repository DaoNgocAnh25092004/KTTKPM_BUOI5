export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
}

export interface OrderItem {
  foodId: number;
  foodName: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: number;
  userId: number;
  username: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: Date;
}
