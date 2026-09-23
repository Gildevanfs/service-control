import { IsBoolean, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreatePositionDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 200)
  name: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}