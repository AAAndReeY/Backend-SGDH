import { Module } from '@nestjs/common';
import { CoordinatorService } from './coordinator.service';
import { CoordinatorController } from './coordinator.controller';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [CoordinatorController],
  providers: [CoordinatorService],
})
export class CoordinatorModule {}
