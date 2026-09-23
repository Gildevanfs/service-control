import { Exclude, Expose, plainToInstance } from 'class-transformer';
import { User } from '../user.entity';

export class UserResponseDto {
  @Expose()
  id: string;

  @Expose()
  companyId: string;

  @Expose()
  email: string;

  @Expose()
  name: string;

  @Expose()
  phone?: string;

  @Expose()
  temporaryPassword: boolean;

  @Expose()
  isActive: boolean;

  @Exclude()
  passwordHash: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  static from(user: User): UserResponseDto {
    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }
}
