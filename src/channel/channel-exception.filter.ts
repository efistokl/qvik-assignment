import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ArticleNotFoundException,
  ChannelException,
  ChannelNotFoundException,
} from './channel.exception';

@Catch(ChannelException)
export class ChannelExceptionFilter implements ExceptionFilter {
  catch(exception: ChannelException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = this.mapExceptionSubTypeToStatusCode(exception);

    response.status(status).json({
      statusCode: status,
      message: exception.message,
    });
  }

  private mapExceptionSubTypeToStatusCode(exception: ChannelException) {
    if (
      exception instanceof ChannelNotFoundException ||
      exception instanceof ArticleNotFoundException
    ) {
      return HttpStatus.NOT_FOUND;
    }
    return HttpStatus.BAD_REQUEST;
  }
}
