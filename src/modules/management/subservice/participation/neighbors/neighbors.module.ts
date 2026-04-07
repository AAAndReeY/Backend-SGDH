import { Module } from '@nestjs/common';
import { NeighborsService } from './neighbors.service';
import { NeighborsController } from './neighbors.controller';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [NeighborsController],
  providers: [NeighborsService],
})
export class NeighborsModule {}
