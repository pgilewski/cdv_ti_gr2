import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req } from '@nestjs/common';

import { ActiveUserData } from '../iam/interfaces/active-user-data.interface';
import { ActiveUser } from '../iam/decorators/active-user.decorator';
import { Roles } from '../iam/authorization/decorators/roles.decorator';
import { Role } from '../users/enums/role.enum';
import { Permission } from '../iam/authorization/permission.type';
import { Permissions } from '../iam/authorization/decorators/permissions.decorator';
import { Policies } from '../iam/authorization/decorators/policies.decorator';
import { FrameworkContributorPolicy } from '../iam/authorization/policies/framework-contributor.policy';

import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';

@Controller('reports')
export class ReportsController {
  constructor(private readonly ReportsService: ReportsService) {}

  @Get('daily')
  async getDailyReport(@Query('day') day: string, @Query('user') user: string, @Req() req: any) {
    const userId = user || req.user.id;
    console.log(user, req);
    return user;
    // return await this.ReportsService.getDailyReport(day, userId);
  }

  @Get('monthly')
  async getMonthlyReport(@Query('date') date: string, @Query('user') user: string, @Req() req: any) {
    const userId = user || req.user.id;
    console.log(user, req);
    return user;

    // return await this.ReportsService.getMonthlyReport(date, userId);
  }

  // @Roles(Role.Admin)
  // @Permissions(Permission.CreateReport)
  // you can apply multiple policies to a single endpoint
  // @Policies(new FrameworkContributorPolicy() /** new MinAgePolicy(18), new OnlyAdminPolicy() */)
  @Post()
  create(@Body() createReportDto: CreateReportDto) {
    return this.ReportsService.create(createReportDto);
  }

  @Get()
  findAll(@ActiveUser() activeUser: ActiveUserData) {
    console.log(activeUser);
    return this.ReportsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ReportsService.findOne(+id);
  }

  // @Roles(Role.Admin)
  // @Permissions(Permission.UpdateReport)
  // @Policies(new FrameworkContributorPolicy())
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReportDto: UpdateReportDto) {
    return this.ReportsService.update(+id, updateReportDto);
  }

  // @Roles(Role.Admin)
  // @Permissions(Permission.DeleteReport)
  @Policies(new FrameworkContributorPolicy())
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ReportsService.remove(+id);
  }
}
