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
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { ChannelExceptionFilter } from './channel-exception.filter';
import { ChannelService } from './channel.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';

@Controller('channel')
@UseFilters(new ChannelExceptionFilter())
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Post()
  @ApiCreatedResponse({ description: 'Channel created' })
  @ApiBadRequestResponse({
    description: 'Validation error or other channel with given name exists',
  })
  create(@Body() createChannelDto: CreateChannelDto) {
    return this.channelService.create(createChannelDto);
  }

  @Get()
  @ApiOkResponse({ description: 'Success' })
  findAll() {
    return this.channelService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Channel found' })
  @ApiNotFoundResponse({ description: 'Channel not found' })
  findOne(@Param('id') id: string) {
    return this.channelService.findOne(+id);
  }

  @Patch(':id')
  @ApiOkResponse({ description: 'Channel updated' })
  @ApiNotFoundResponse({ description: 'Channel not found' })
  @ApiBadRequestResponse({
    description: 'Validation error or other channel with given name exists',
  })
  update(@Param('id') id: string, @Body() updateChannelDto: UpdateChannelDto) {
    return this.channelService.update(+id, updateChannelDto);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Channel deleted' })
  remove(@Param('id') id: string) {
    return this.channelService.remove(+id);
  }

  @Put(':id/postArticle/:articleId')
  @ApiOkResponse({
    description: 'Article added to the Channel',
  })
  @ApiNotFoundResponse({ description: 'Channel or Article not found' })
  addArticles(@Param('id') id: string, @Param('articleId') articleId: string) {
    return this.channelService.addArticle(+id, +articleId);
  }

  @Put(':id/unpostArticle/:articleId')
  @ApiOkResponse({
    description:
      "Article removed from the Channel. This is returned even when the article wasn't there",
  })
  @ApiNotFoundResponse({ description: 'Channel not found' })
  removeArticles(
    @Param('id') id: string,
    @Param('articleId') articleId: string,
  ) {
    return this.channelService.removeArticle(+id, +articleId);
  }
}
