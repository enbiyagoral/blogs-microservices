import { Controller, Get } from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller()
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  getHello(): string {
    return this.categoriesService.getHello();
  }
}
