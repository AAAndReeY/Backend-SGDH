import { Module } from '@nestjs/common';
import { CensusService } from './census.service';
import { CensusController } from './census.controller';

@Module({
  controllers: [CensusController],
  providers: [CensusService],
})
export class CensusModule {}
