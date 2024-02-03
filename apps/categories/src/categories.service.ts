import { Injectable } from '@nestjs/common';

@Injectable()
export class CategoriesService {
  getHello(): string {
    return 'Hello World!';
  }
}
