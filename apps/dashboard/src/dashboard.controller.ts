import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  getHello(): string {
    return this.dashboardService.getHello();
  }
}
