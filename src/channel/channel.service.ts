import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from './entities/channel.entity';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import {
  ArticleNotFoundException,
  ChannelExistsException,
  ChannelNotFoundException,
} from './channel.exception';
import {
  isForeignKeyConstraintErrorSqlite,
  isUniqueConstraintErrorSqlite,
} from '../helpers/sqliteErrors.helper';

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel)
    private channelRepository: Repository<Channel>,
  ) {}

  async create(createChannelDto: CreateChannelDto): Promise<Channel> {
    const channel = await this.channelRepository.create({
      name: createChannelDto.name,
    });
    return await this.saveChannel(channel);
  }

  findAll(): Promise<Channel[]> {
    return this.channelRepository.find();
  }

  async findOne(id: number): Promise<Channel> {
    const channel = await this.channelRepository.findOne(id, {
      relations: ['articles'],
    });
    if (channel === undefined) {
      throw new ChannelNotFoundException();
    }
    return channel;
  }

  async update(id: number, updateChannelDto: UpdateChannelDto): Promise<void> {
    const channel = await this.findOne(id);
    channel.name = updateChannelDto.name;
    await this.saveChannel(channel);
  }

  async remove(id: number): Promise<void> {
    await this.channelRepository.delete(id);
  }

  async addArticle(id: number, articleId: number) {
    const channel = await this.findOne(id);
    const article = channel.articles.find(
      (article) => article.id === articleId,
    );

    if (article !== undefined) {
      return;
    }

    await this.channelRepository
      .createQueryBuilder()
      .relation(Channel, 'articles')
      .of(channel)
      .add(articleId);
  }

  async removeArticle(id: number, articleId: number) {
    const channel = await this.findOne(id);
    await this.channelRepository
      .createQueryBuilder()
      .relation(Channel, 'articles')
      .of(channel)
      .remove(articleId);
  }

  private async saveChannel(channel: Channel) {
    try {
      return await this.channelRepository.save(channel);
    } catch (error) {
      if (isUniqueConstraintErrorSqlite(error)) {
        throw new ChannelExistsException();
      } else if (isForeignKeyConstraintErrorSqlite(error)) {
        throw new ArticleNotFoundException();
      } else {
        throw error;
      }
    }
  }
}
