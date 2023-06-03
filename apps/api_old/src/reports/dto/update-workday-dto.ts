// UpdateWorkDayDto.ts
import { IsDate, IsOptional, IsBoolean, IsString } from 'class-validator';

export class UpdateWorkDayDto {
  @IsDate()
  @IsOptional()
  date?: Date;

  @IsBoolean()
  @IsOptional()
  isReviewed?: boolean;

  @IsString()
  @IsOptional()
  reviewedBy?: number;
}
