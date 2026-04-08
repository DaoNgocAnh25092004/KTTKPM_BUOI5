import { IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { Role } from '../entities/user.entity';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  @MinLength(4)
  password: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
