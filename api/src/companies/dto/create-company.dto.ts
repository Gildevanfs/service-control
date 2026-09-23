import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { IsValidCnpj, onlyDigits } from '../../common/validators';

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 200)
  name: string;

  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? onlyDigits(value) : value))
  @IsValidCnpj({ message: 'CNPJ inválido' })
  cnpj: string;

  @IsOptional()
  @IsString()
  @Length(10, 20)
  phone?: string;

  @IsOptional()
  @IsString()
  @Length(1, 200)
  addressStreet?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  addressCity?: string;

  @IsOptional()
  @IsString()
  @Length(2, 2)
  addressState?: string;

  @IsOptional()
  @IsString()
  @Length(8, 8)
  addressZipcode?: string;

  @IsOptional()
  @IsString()
  @Length(1, 500)
  logo?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}