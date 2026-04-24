import { Module } from '@nestjs/common';
import { SupService } from './sup.service';
import { SupController } from './sup.controller';
import { CommonModule } from 'src/common/common.module';
 
@Module({
  imports: [CommonModule],
  controllers: [SupController],
  providers: [SupService],
})
export class SupModule {}