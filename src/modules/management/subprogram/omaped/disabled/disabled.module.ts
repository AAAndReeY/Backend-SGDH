import { Module } from '@nestjs/common';
import { DisabledService } from './disabled.service';
import { DisabledController } from './disabled.controller';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [DisabledController],
  providers: [DisabledService],
})
export class DisabledModule {}
