import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { SignUpDto } from 'apps/auth/src/dto/sign-up.dto';
import * as bcrypt from 'bcrypt';
import { SignInDto } from 'apps/auth/src/dto/sign-in.dto';
import { NotFoundError } from 'rxjs';
import { UserDocument } from './models/users.schema';
import { FilterQuery } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository){}
  getHello(): string {
    return 'Hello World! Users';
  }

  async createUser(signUpDto: SignUpDto){
    try {
      const {email, password, username, birthdate} = signUpDto;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await this.usersRepository.create({
        email,
        password: hashedPassword,
        username,
        birthdate,
        isVerified: false,
      });
      return {success: true, data: user, message: "Kullanıcı oluşturuldu"};
    } catch (error) {
      console.log(error)
    }
  };

  async login(signInDto:SignInDto){
    try {
      const {email, password } = signInDto;
      const user = await this.usersRepository.findOne({email});
      if(!user){
        throw new NotFoundException();
      }
      const checkPassword = await bcrypt.compare(password,user.password);
      if(!checkPassword){
        return {success: false, data: null, message: "Mail veya hatalı şifre"};
      }
      
      return {success: true, data: user, message: "Giriş başarılı"};
    } catch (error) {
      console.log(error)
    }
  };

  async getUser(signInDto:SignInDto){
    try {
      const {email, password } = signInDto;
      const user = await this.usersRepository.findOne({email});
      if(!user){
        return false;
      }
      return true;
    } catch (error) {
      console.log(error)
    }
  };

  async findOne(query: FilterQuery<UserDocument>){
    this.usersRepository.findOne(query)
  }

  async handleAddLikeToUser({userId, blogId}: any){
    const result = await this.usersRepository.findOneAndUpdate({_id: userId}, {
      $push: {
        liked: blogId,
      }
    })
    return result;
  }

  async handleRemoveLikeToUser({userId, blogId}: any){
    const result = await this.usersRepository.findOneAndUpdate({_id: userId}, {
      $pull: {
        liked: blogId,
      }
    })
    return result;
  }
  
  async handleAddSaveToUser({userId, blogId}: any){
    const result = await this.usersRepository.findOneAndUpdate({_id: userId}, {
      $push: {
        saved: blogId,
      }
    })
    return result;
  }

  async handleRemoveSaveToUser({userId, blogId}: any){
    const result = await this.usersRepository.findOneAndUpdate({_id: userId}, {
      $pull: {
        saved: blogId,
      }
    })
    return result;
  }

  async handleAddBlogFromUser(data){
    const result = await this.usersRepository.findOneAndUpdate({_id: data.authorId}, {
      $push: {
        blogs: data.blogId
      }
    })
    return result;
  }

  async handleRemoveBlogFromUser({blogId, authorId}: any){
    
      const blog = await this.usersRepository.findOneAndUpdate({_id: authorId}, {

        $pull: {
          blogs: blogId,
        },
      })
  
      return blog
  }
}
