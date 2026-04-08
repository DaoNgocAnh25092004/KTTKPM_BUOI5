export enum PaymentMethod {
  COD = 'COD',
  BANKING = 'BANKING',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

export interface Payment {
  id: number;
  orderId: number;
  userId: number;
  method: PaymentMethod;
  status: PaymentStatus;
  createdAt: Date;
}
