import { Injectable } from '@nestjs/common';
import { WorkDay } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

import { CreateReportDto } from './dto/create-report.dto';
import { CreateTaskHourDto } from './dto/create-taskhour-dta';
import { CreateWorkDayDto } from './dto/create-workday-dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { UpdateTaskHourDto } from './dto/update-taskhour-dto';
import { UpdateWorkDayDto } from './dto/update-workday-dto';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async getWorkDay(day?: string, userId?: number): Promise<WorkDay[]> {
    let whereClause = {};

    if (day && userId) {
      whereClause = {
        AND: [
          {
            date: {
              gte: new Date(`${day}T00:00:00`),
              lte: new Date(`${day}T23:59:59`),
            },
          },
          {
            userId: userId,
          },
        ],
      };
    } else if (day) {
      whereClause = {
        date: {
          gte: new Date(`${day}T00:00:00`),
          lte: new Date(`${day}T23:59:59`),
        },
      };
    } else if (userId) {
      whereClause = {
        userId: userId,
      };
    }

    return this.prisma.workDay.findMany({
      where: whereClause,
      include: {
        hours: true,
        comments: true,
      },
    });
  }

  async createWorkDay(data: CreateWorkDayDto) {
    const workDay = { ...data, isReviewed: false, reviewedBy: undefined };
    return await this.prisma.workDay.create({ data: workDay });
  }

  // async updateWorkDay(id: number, data: UpdateWorkDayDto) {
  //   return await this.prisma.workDay.update({
  //     where: { id },
  //     data,
  //   });
  // }

  async createTaskHour(data: CreateTaskHourDto) {
    return await this.prisma.taskHour.create({ data });
  }

  async updateTaskHour(id: number, data: UpdateTaskHourDto) {
    return await this.prisma.taskHour.update({
      where: { id },
      data,
    });
  }
}
