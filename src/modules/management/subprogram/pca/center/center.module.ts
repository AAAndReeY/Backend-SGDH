import { Module } from '@nestjs/common';
import { CenterService } from './center.service';
import { CenterController } from './center.controller';

@Module({
  controllers: [CenterController],
  providers: [CenterService],
})
export class CenterModule {}
