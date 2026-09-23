import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';
import { IsValidCnpj, onlyDigits } from '../../common/validators';

export class CreateBranchDto {
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
  @Length(1, 20)
  addressNumber?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  addressNeighborhood?: string;

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
  @Length(2, 200)
  manager?: string;

  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude?: number;

  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(10000)
  validationRadiusM?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
