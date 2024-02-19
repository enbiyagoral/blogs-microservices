import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { SignUpDto } from 'apps/auth/src/dto/sign-up.dto';
import { SignInDto } from 'apps/auth/src/dto/sign-in.dto';


@Controller()
export class UsersMessagingController {
  constructor(
    private readonly usersService: UsersService) {}

  @EventPattern('handleSignup')
  async createUser(@Payload('signupDto') signupDto: SignUpDto) {
    try {
      console.log("Message COntroller ")
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
    console.log("araba");
    return await this.usersService.login(signInDto);
  }

  @MessagePattern({cmd: 'get' })
  getUser1(data: any){
    return this.usersService.findOne({ email: data.email });
  }

  @MessagePattern({cmd: 'getUseById' })
  getUserById(data: any){
    return this.usersService.handleGetUserById({ _id: data._id });
  }

  @MessagePattern({cmd: 'getSubscriber' })
  getSubscriber(@Payload() data: any){
    console.log("DENEME1",data);
    return this.usersService.handleGetSubscriber(data);
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

  @MessagePattern({cmd: 'getFollowingUsers'})
  async getFollowingUsers(@Payload() data:any){
    return this.usersService.handleGetFollowingUsers(data);
  }

  @MessagePattern({cmd: 'updatedPasswordByUser'})
  async updatedPasswordByUser(@Payload() data: any){
    return this.usersService.handleUpdatePasswordByUser({_id:data._id, password: data.password});
  }
}
