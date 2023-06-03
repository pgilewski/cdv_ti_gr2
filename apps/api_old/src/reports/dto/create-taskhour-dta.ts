import { IsNumber, IsString } from 'class-validator';

export class CreateTaskHourDto {
  @IsNumber()
  taskId!: number;

  @IsNumber()
  userId!: number;

  @IsString()
  startTime!: string;

  @IsString()
  endTime!: string;

  @IsNumber()
  duration!: number;
}
