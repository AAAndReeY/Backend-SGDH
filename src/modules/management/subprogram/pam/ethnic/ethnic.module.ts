import { Module } from '@nestjs/common';
import { EthnicService } from './ethnic.service';
import { EthnicController } from './ethnic.controller';

@Module({
  controllers: [EthnicController],
  providers: [EthnicService],
})
export class EthnicModule {}
