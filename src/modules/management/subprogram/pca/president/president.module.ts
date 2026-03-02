import { Module } from '@nestjs/common';
import { PresidentService } from './president.service';
import { PresidentController } from './president.controller';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [PresidentController],
  providers: [PresidentService],
})
export class PresidentModule {}
