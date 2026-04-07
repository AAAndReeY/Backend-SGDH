import { Module } from '@nestjs/common';
import { UrbanService } from './urban.service';
import { UrbanController } from './urban.controller';

@Module({
  controllers: [UrbanController],
  providers: [UrbanService],
})
export class UrbanModule {}
