import { Controller, Delete, Get, Inject, Param, Patch, UseGuards,} from '@nestjs/common';
import { UsersService } from './users.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { SignUpDto } from 'apps/auth/src/dto/sign-up.dto';
import { SignInDto } from 'apps/auth/src/dto/sign-in.dto';
import { AuthGuard, CurrentUser } from '@app/common/auth';

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

  @EventPattern('handleSignup')
  async createUser(@Payload('signupDto') signupDto: SignUpDto) {
    try {
      return await this.usersService.createUser(signupDto);
    } catch (error) {
      console.error('Error while creating user:', error.message);
      throw error;
    }
  }

  @EventPattern('get-user')
  async getUser(@Payload('signInDto') signInDto:SignInDto){
    return await this.usersService.getUser(signInDto);
  }

  @EventPattern('handleLogin')
  async login(@Payload('signInDto') signInDto:SignInDto){
    return await this.usersService.login(signInDto);
  }

  @MessagePattern({cmd: 'get' })
  getUser1(data: any){
    return this.usersService.findOne({ email: data.email });
  }

  @MessagePattern({cmd: 'addLikeToUser'})
  async addLikeToUser(@Payload() data: any){
    return this.usersService.handleAddLikeToUser(data);
  }

  @MessagePattern({cmd: 'removeLikeToUser'})
  async removeLikeToUser(@Payload() data: any){
    return this.usersService.handleRemoveLikeToUser(data);
  }

  @MessagePattern({cmd: 'addSaveToUser'})
  async addSaveToUser(@Payload() data: any){
    return this.usersService.handleAddSaveToUser(data);
  }

  @MessagePattern({cmd: 'removeSaveToUser'})
  async removeSaveToUser(@Payload() data: any){
    return this.usersService.handleRemoveSaveToUser(data);
  }
  
  @MessagePattern({cmd: 'addBlogFromUser'})
  async addBlogFromUser(@Payload() data: any){
    console.log(data)
    return this.usersService.handleAddBlogFromUser(data);
  }

  @MessagePattern({cmd: 'removeBlogFromUser'})
  async removeBlogFromUser(@Payload() data:any){
    return this.usersService.handleRemoveBlogFromUser(data);
  }


  // DASHBOARD SERVICING 
  @MessagePattern({cmd: 'getFollowingUsers'})
  async getFollowingUsers(@Payload() data:any){
    return this.usersService.handleGetFollowingUsers(data);
  }

  
}
