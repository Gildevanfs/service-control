import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';
import { IsValidCpf, onlyDigits } from '../../common/validators';

export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 200)
  name: string;

  @Transform(({ value }) => onlyDigits(value))
  @IsValidCpf()
  cpf: string;

  @IsOptional()
  @IsString()
  @Length(8, 20)
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @IsOptional()
  @IsDateString()
  hireDate?: string;

  @IsOptional()
  @IsUUID()
  positionId?: string;

  @IsOptional()
  @IsUUID()
  branchId?: string;

  @IsOptional()
  @IsUUID()
  teamId?: string;

  @IsOptional()
  @IsUUID()
  superiorId?: string;

  @IsOptional()
  @IsIn(['ativo', 'afastado', 'inativo'])
  status?: 'ativo' | 'afastado' | 'inativo';
}