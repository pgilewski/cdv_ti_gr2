import { IsNumber, IsDate } from 'class-validator';

export class CreateWorkDayDto {
  @IsNumber()
  userId!: number;

  @IsDate()
  date!: string;
}
