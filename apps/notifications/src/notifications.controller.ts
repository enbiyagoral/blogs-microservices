import { Controller, Get, Inject, UsePipes, ValidationPipe } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { ClientProxy, EventPattern, Payload } from '@nestjs/microservices';


@Controller()
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    @Inject('USERS_CLIENT') private readonly usersClient: ClientProxy,
    ) {}

  @EventPattern('notify_email')
  async notifyEmail(@Payload() data: any) {
    console.log(data);
    const userEmails = await this.usersClient.send({cmd: 'getSubscriber'}, {userId: data.userId}).toPromise();

    for (let i=0; i < userEmails.length; i++) {
      await this.notificationsService.subscribeBlogs(userEmails[i], data.blogLink)
    }
  }
}
