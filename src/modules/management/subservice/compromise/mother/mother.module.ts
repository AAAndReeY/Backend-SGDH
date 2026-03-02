import { Module } from '@nestjs/common';
import { MotherService } from './mother.service';
import { MotherController } from './mother.controller';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [MotherController],
  providers: [MotherService],
})
export class MotherModule {}
