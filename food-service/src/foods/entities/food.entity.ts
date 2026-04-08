export interface Food {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  available: boolean;
  createdAt: Date;
}
