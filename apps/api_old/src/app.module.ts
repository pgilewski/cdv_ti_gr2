import { Module } from '@nestjs/common';

import { ReportsModule } from './reports/reports.module';
import { ResourcesModule } from './resources/resources.module';

@Module({
  imports: [ResourcesModule, ReportsModule],
})
export class AppModule {}
