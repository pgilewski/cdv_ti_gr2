// UpdateTaskHourDto.ts
import { IsNumber, IsString, IsOptional } from 'class-validator';

export class UpdateTaskHourDto {
  @IsString()
  @IsOptional()
  startTime?: string;

  @IsString()
  @IsOptional()
  endTime?: string;

  @IsNumber()
  @IsOptional()
  duration?: number;
}
