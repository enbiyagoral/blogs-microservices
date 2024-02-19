import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, UseGuards,} from '@nestjs/common';
import { UsersService } from './users.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { SignUpDto } from 'apps/auth/src/dto/sign-up.dto';
import { SignInDto } from 'apps/auth/src/dto/sign-in.dto';
import { AuthGuard, CurrentUser } from '@app/common/auth';
import { RePasswordDto } from './dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Patch('follow/:id')
  async follow(@CurrentUser() userId: string, @Param('id') id: string) {
    return await this.usersService.follow(userId, id)
  }

  @UseGuards(AuthGuard)
  @Patch('unfollow/:id')
  async unFollow(@CurrentUser() userId: string, @Param('id') id: string) {
    return await this.usersService.unFollow(userId, id)
  }

  @UseGuards(AuthGuard)
  @Delete('/delete-user')
  async deleteUser(@CurrentUser() user: string) {
    return this.usersService.deleteUser(user)
  }

  @Get('/:username/likes')
  async getLikes(@Param('username') username: string) {
    return this.usersService.getLikesByUsername(username)
  }
  
  @UseGuards(AuthGuard)
  @Post('/reset-password')
  async resetPassword(@CurrentUser() user: string, @Body() rePasswordDto: RePasswordDto) {
    return this.usersService.resetPassword(user, rePasswordDto)
  }

}
