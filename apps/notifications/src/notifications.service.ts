import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as Mailgen from 'mailgen';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NotificationsService {
  private transporter: nodemailer.Transporter;
  private mailGenerator: Mailgen;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.email',
      port: 587,
      secure: true,
      auth: {
        user: this.configService.get('MAIL_USER'),
        pass: this.configService.get('PASS'),
      }
    });

    this.mailGenerator = new Mailgen({
      theme: 'default',
      product: {
        name: 'Mailgen',
        link: 'https://mailgen.js/'
      }
    });
  }

  async subscribeBlogs(userEmails: string, blogLink: string): Promise<boolean> {
    try {
      
      const email = {
        body: {
          intro: blogLink,
          outro: "Need help, or have questions? Just reply to this email, we'd love to help."
        }
      };

      const emailBody = await this.mailGenerator.generate(email);
      const message = {
        from: this.configService.get('USER'),
        to: userEmails.toString(),
        subject: 'A New Blog',
        html: emailBody
      };

      const info = await this.transporter.sendMail(message);
     
      console.log('Message sent: %s', info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      return true;
    } catch (error) {
      console.log(error, 'in sending email');
      return false;
    }
  }
}
