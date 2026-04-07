import { Module } from '@nestjs/common';
import { TownService } from './town.service';
import { TownController } from './town.controller';

@Module({
  controllers: [TownController],
  providers: [TownService],
})
export class TownModule {}
