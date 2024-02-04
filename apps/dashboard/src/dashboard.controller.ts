import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AuthGuard, CurrentUser } from '@app/common/auth';

@UseGuards(AuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  getHomePage(@CurrentUser() currentUserId: string) {
    return this.dashboardService.getHomePage(currentUserId)
  }

  @Get('/most-like')
  getMostLikedBlogs() {
    return this.dashboardService.getMostLikedBlogs()
  }

  @Get('/most-saved')
  getMostSavedBlogs() {
    return this.dashboardService.getMostSavedBlogs()
  }
}
