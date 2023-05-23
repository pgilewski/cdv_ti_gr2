import { Injectable } from '@nestjs/common';

import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';

@Injectable()
export class ReportsService {
  create(createReportDto: CreateReportDto) {
    return 'This action adds a new reports';
  }

  findAll() {
    return `This action returns all reports`;
  }

  findOne(id: number) {
    return `This action returns a #${id} reports`;
  }

  update(id: number, updateReportDto: UpdateReportDto) {
    return `This action updates a #${id} reports`;
  }

  remove(id: number) {
    return `This action removes a #${id} reports`;
  }
}
