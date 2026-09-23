import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 200)
  name: string;

  @IsString()
  @Matches(/^\d{14}$/, { message: 'CNPJ must contain only 14 digits' })
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