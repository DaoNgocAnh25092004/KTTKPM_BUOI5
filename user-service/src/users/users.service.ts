import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { User, Role } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class UsersService {
  private users: User[] = [];
  private idCounter = 1;

  register(dto: CreateUserDto): Omit<User, 'password'> {
    const exists = this.users.find((u) => u.username === dto.username);
    if (exists) {
      throw new ConflictException('Username already taken');
    }

    const newUser: User = {
      id: this.idCounter++,
      username: dto.username,
      password: dto.password, // plain text for demo
      role: dto.role ?? Role.USER,
      createdAt: new Date(),
    };

    this.users.push(newUser);
    const { password, ...result } = newUser;
    return result;
  }

  login(dto: LoginDto): { userId: number; username: string; role: Role } {
    const user = this.users.find(
      (u) => u.username === dto.username && u.password === dto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return { userId: user.id, username: user.username, role: user.role };
  }

  findAll(): Omit<User, 'password'>[] {
    return this.users.map(({ password, ...u }) => u);
  }

  findOne(id: number): Omit<User, 'password'> {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    const { password, ...result } = user;
    return result;
  }
}
