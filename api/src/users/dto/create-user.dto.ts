import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsUUID()
  companyId: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(2, 200)
  name: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  @Length(10, 20)
  phone?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
