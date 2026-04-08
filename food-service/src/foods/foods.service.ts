import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { Food } from './entities/food.entity';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';

@Injectable()
export class FoodsService implements OnModuleInit {
  private foods: Food[] = [];
  private idCounter = 1;

  onModuleInit() {
    const seedData = [
      {
        name: 'Cơm Gà Xối Mỡ',
        description: 'Cơm trắng, gà rán giòn, rau sống',
        price: 45000,
        category: 'Cơm',
        imageUrl: '',
      },
      {
        name: 'Bún Bò Huế',
        description: 'Bún, bò, mọc, chả, sả',
        price: 55000,
        category: 'Bún',
        imageUrl: '',
      },
      {
        name: 'Phở Bò Tái Chín',
        description: 'Phở bò truyền thống, tái + chín',
        price: 60000,
        category: 'Phở',
        imageUrl: '',
      },
      {
        name: 'Bánh Mì Thịt Nguội',
        description: 'Bánh mì giòn, chả lụa, pate, rau',
        price: 25000,
        category: 'Bánh Mì',
        imageUrl: '',
      },
      {
        name: 'Mì Xào Bò',
        description: 'Mì vàng xào với thịt bò và rau cải',
        price: 50000,
        category: 'Mì',
        imageUrl: '',
      },
      {
        name: 'Cơm Tấm Sườn Nướng',
        description: 'Cơm tấm, sườn nướng, bì, chả',
        price: 55000,
        category: 'Cơm',
        imageUrl: '',
      },
      {
        name: 'Gỏi Cuốn Tôm Thịt',
        description: '2 cuốn gỏi, tôm, thịt, rau sống',
        price: 30000,
        category: 'Ăn nhẹ',
        imageUrl: '',
      },
      {
        name: 'Nước Mía',
        description: 'Nước mía tươi, đá',
        price: 15000,
        category: 'Đồ uống',
        imageUrl: '',
      },
    ];

    for (const item of seedData) {
      this.foods.push({
        id: this.idCounter++,
        ...item,
        available: true,
        createdAt: new Date(),
      });
    }
  }

  findAll(): Food[] {
    return this.foods;
  }

  findOne(id: number): Food {
    const food = this.foods.find((f) => f.id === id);
    if (!food) throw new NotFoundException(`Food #${id} not found`);
    return food;
  }

  create(dto: CreateFoodDto): Food {
    const food: Food = {
      id: this.idCounter++,
      name: dto.name,
      description: dto.description,
      price: dto.price,
      category: dto.category,
      imageUrl: dto.imageUrl ?? '',
      available: dto.available !== undefined ? dto.available : true,
      createdAt: new Date(),
    };
    this.foods.push(food);
    return food;
  }

  update(id: number, dto: UpdateFoodDto): Food {
    const index = this.foods.findIndex((f) => f.id === id);
    if (index === -1) throw new NotFoundException(`Food #${id} not found`);
    this.foods[index] = { ...this.foods[index], ...dto };
    return this.foods[index];
  }

  remove(id: number): { message: string } {
    const index = this.foods.findIndex((f) => f.id === id);
    if (index === -1) throw new NotFoundException(`Food #${id} not found`);
    this.foods.splice(index, 1);
    return { message: `Food #${id} deleted` };
  }
}
