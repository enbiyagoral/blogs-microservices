import { BadRequestException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { SignUpDto } from 'apps/auth/src/dto/sign-up.dto';
import * as bcrypt from 'bcrypt';
import { SignInDto } from 'apps/auth/src/dto/sign-in.dto';
import { NotFoundError } from 'rxjs';
import { UserDocument } from './models/users.schema';
import { FilterQuery } from 'mongoose';
import { ClientProxy } from '@nestjs/microservices';
import { RePasswordDto } from './dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject('BLOGS_CLIENT') private readonly blogsClient: ClientProxy,
    private readonly usersRepository: UsersRepository){}
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

  async follow(userId: string, id: string) {
    const myUser = await this.usersRepository.findOne({ _id: userId })
    const otherUser = await this.usersRepository.findOne({ _id: id })
    
    if (otherUser._id == myUser._id) throw new BadRequestException('Kendinizi takip edemezsiniz')

    if (
      !myUser.following?.map(String).includes(otherUser._id.toString()) &&
      !otherUser.followers?.map(String).includes(myUser._id.toString())
      ) {
      const newMyUser = await this.usersRepository.findOneAndUpdate({_id: myUser._id}, {
        $push: {
          following: otherUser._id,
        },
      })

      const newOtherUser = await this.usersRepository.findOneAndUpdate({_id: otherUser._id}, {
        $push: {
         followers: myUser._id,
        },
      })

      return { newMyUser, newOtherUser }
    }

    return "Zaten Takip ediyorsunuz"
  }

  async unFollow(userId: string, id: string) {
    const myUser = await this.usersRepository.findOne({ _id: userId })
    const otherUser = await this.usersRepository.findOne({ _id: id })

    if (otherUser._id == myUser._id) throw new BadRequestException('Kendinizi takip edemezsiniz')

    if (
      myUser.following?.map(String).includes(otherUser._id.toString()) && 
      otherUser.followers?.map(String).includes(myUser._id.toString())
      ) {
      const newMyUser = await this.usersRepository.findOneAndUpdate({_id: myUser._id}, {
        $pull: {
          following: otherUser._id,
        },
      })

      const newOtherUser = await this.usersRepository.findOneAndUpdate({_id: otherUser._id}, {
        $pull: {
          followers: myUser._id,
        },
      })
      return { newMyUser, newOtherUser }
    }

    return "Zaten Takip etmiyorsunuz"
  }

  async deleteUser(id: string) {
    const user = await this.usersRepository.findOneAndDelete({_id:id})

    const updateQuery = {
      $or: [{ followers: id }, { following: id }],
    }

    const updateFields = {
      $pull: {
        followers: id,
        following: id,
      },
    }

    await this.usersRepository.updateMany(updateQuery, updateFields)
    const deleteBlogsFromByUser = this.blogsClient.send({cmd: 'deleteBlogsFromByUser'}, { authorId: id}).toPromise();

    return user
  }

  async getLikesByUsername(username: string) {
    const result = await this.usersRepository.findOne({ username })
    return result.liked
  }


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
    const user = await this.usersRepository.findOne(query);
    return { _id: user._id, password:user.password }
  }

  async resetPassword(userId: string, rePasswordDto: RePasswordDto) {
    const user = await this.usersRepository.findOne({ _id: userId })
    if (!user) throw new UnauthorizedException()

    const isCheckPassword = await bcrypt.compare(rePasswordDto.password, user.password)

    if (!isCheckPassword) throw new UnauthorizedException('Eski şifreniz yanlış girildi.')

    if (rePasswordDto.newPassword !== rePasswordDto.confirmPassword){
      throw new UnauthorizedException('Girmek istediğiniz yeni şifreler aynı değil.')
    }

    const isSamePassword = await bcrypt.compare(rePasswordDto.confirmPassword, user.password);
    if (isSamePassword) {
      throw new UnauthorizedException('Eski şifreniz ile yeni şifreniz aynı olamaz!')
    }

    const hashedPassword = await bcrypt.hash(rePasswordDto.confirmPassword, 10)

    const updatedPasswordByUser = await this.usersRepository.findOneAndUpdate({_id: user._id}, {
      $set: {
        password: hashedPassword
      }
    });

    return 'Şifreniz Başarıyla Güncellendi!'
  }


  async handleGetUserById(query: FilterQuery<UserDocument>){
    const user = await this.usersRepository.findOne(query);
    return { _id: user._id, password:user.password }
  }

  async handleUpdatePasswordByUser({_id, password}: any){
    const user = await this.usersRepository.findOneAndUpdate({_id},{
      $set: {
        password
      }
    });

    return user
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

  async handleGetFollowingUsers({_id}: any){
    const users = await this.usersRepository.findOne({ _id })
    console.log(users.following);
    return users.following
  }
}
