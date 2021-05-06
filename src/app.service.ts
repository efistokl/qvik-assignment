import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  statusOk(): string {
    return 'ok';
  }
}
