import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Put,
  Delete,
  UseFilters,
} from '@nestjs/common';
import { ChannelExceptionFilter } from './channel-exception.filter';
import { ChannelService } from './channel.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';

@Controller('channel')
@UseFilters(new ChannelExceptionFilter())
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Post()
  create(@Body() createChannelDto: CreateChannelDto) {
    return this.channelService.create(createChannelDto);
  }

  @Get()
  findAll() {
    return this.channelService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.channelService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChannelDto: UpdateChannelDto) {
    return this.channelService.update(+id, updateChannelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.channelService.remove(+id);
  }

  @Put(':id/postArticle/:articleId')
  addArticles(@Param('id') id: string, @Param('articleId') articleId: string) {
    return this.channelService.addArticle(+id, +articleId);
  }

  @Put(':id/unpostArticle/:articleId')
  removeArticles(
    @Param('id') id: string,
    @Param('articleId') articleId: string,
  ) {
    return this.channelService.removeArticle(+id, +articleId);
  }
}
