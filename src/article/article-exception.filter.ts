import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ArticleException,
  ArticleNotFoundException,
} from './article.exception';

@Catch(ArticleException)
export class ArticleExceptionFilter implements ExceptionFilter {
  catch(exception: ArticleException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = this.mapExceptionSubTypeToStatusCode(exception);

    response.status(status).json({
      statusCode: status,
      message: exception.message,
    });
  }

  private mapExceptionSubTypeToStatusCode(exception: ArticleException) {
    if (exception instanceof ArticleNotFoundException) {
      return HttpStatus.NOT_FOUND;
    }
    return HttpStatus.BAD_REQUEST;
  }
}
