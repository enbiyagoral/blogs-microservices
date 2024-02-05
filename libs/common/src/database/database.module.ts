import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ModelDefinition, MongooseModule } from '@nestjs/mongoose';


@Module({
    imports: [
        // MongooseModule.forRoot('mongodb://localhost:27017/api-gateway')
        MongooseModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                uri: configService.get('MONGODB_URI')
            }),
            inject: [ConfigService]
        })
        // MongooseModule.forRootAsync({
        //     useFactory: (configService: ConfigService) => ({
        //         uri: configService.get('MONGODB_URI')
        //     }),
        //     inject: [ConfigService],
        // })
       ]
})
export class DatabaseModule {
    static forFeature(models: ModelDefinition[]){
        return MongooseModule.forFeature(models);
    }
}