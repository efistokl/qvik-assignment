import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from './entities/channel.entity';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import {
  ChannelExistsException,
  ChannelNotFoundException,
} from './channel.exception';
import { isUniqueConstraintErrorSqlite } from '../helpers/uniqueConstraintErrorSqlite.helper';

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel)
    private channelRepository: Repository<Channel>,
  ) {}

  async create(createChannelDto: CreateChannelDto): Promise<void> {
    const channel = await this.channelRepository.create({
      name: createChannelDto.name,
    });
    await this.saveChannel(channel);
  }

  findAll(): Promise<Channel[]> {
    return this.channelRepository.find();
  }

  async findOne(id: number): Promise<Channel> {
    const channel = await this.channelRepository.findOne(id);
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

  private async saveChannel(channel: Channel) {
    try {
      await this.channelRepository.save(channel);
    } catch (error) {
      if (isUniqueConstraintErrorSqlite(error)) {
        throw new ChannelExistsException();
      } else {
        throw error;
      }
    }
  }
}
