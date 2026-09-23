import { plainToInstance, Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
  validateSync,
} from 'class-validator';

class EnvironmentVariables {
  @IsString()
  @IsNotEmpty()
  DB_HOST: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(65535)
  DB_PORT: number;

  @IsString()
  @IsNotEmpty()
  DB_USERNAME: string;

  @IsString()
  @IsNotEmpty()
  DB_PASSWORD: string;

  @IsString()
  @IsNotEmpty()
  DB_DATABASE: string;

  @IsString()
  @IsNotEmpty()
  JWT_SECRET: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  JWT_EXPIRES_IN?: string;

  @IsString()
  @IsNotEmpty()
  SEED_COMPANY_CNPJ: string;

  @IsString()
  @IsNotEmpty()
  SEED_COMPANY_NAME: string;

  @IsString()
  @IsNotEmpty()
  SEED_ADMIN_EMAIL: string;

  @IsString()
  @IsNotEmpty()
  SEED_ADMIN_PASSWORD: string;

  @IsString()
  @IsNotEmpty()
  SEED_ADMIN_NAME: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
