import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from './entities/channel.entity';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';

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
    await this.channelRepository.save(channel);
  }

  findAll(): Promise<Channel[]> {
    return this.channelRepository.find();
  }

  findOne(id: number): Promise<Channel> {
    return this.channelRepository.findOne(id);
  }

  async update(id: number, updateChannelDto: UpdateChannelDto): Promise<void> {
    const channel = await this.channelRepository.findOne(id);
    channel.name = updateChannelDto.name;
    await this.channelRepository.save(channel);
  }

  async remove(id: number): Promise<void> {
    await this.channelRepository.delete(id);
  }
}
