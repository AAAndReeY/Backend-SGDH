import { Module } from '@nestjs/common';
import { CommitteeService } from './committee.service';
import { CommitteeController } from './committee.controller';

@Module({
  controllers: [CommitteeController],
  providers: [CommitteeService],
})
export class ComitteeModule {}
