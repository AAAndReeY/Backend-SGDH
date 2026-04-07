import { Module } from '@nestjs/common';
import { DependentService } from './dependent.service';
import { DependentController } from './dependent.controller';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [DependentController],
  providers: [DependentService],
})
export class DependentModule {}
