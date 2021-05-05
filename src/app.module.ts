import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChannelModule } from './channel/channel.module';
import { Channel } from './channel/entities/channel.entity';
import { ArticleModule } from './article/article.module';
import { Article } from './article/entities/article.entity';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      entities: [Channel, Article],
      synchronize: true,
    }),
    EventEmitterModule.forRoot(),
    ChannelModule,
    ArticleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
