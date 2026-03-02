import { Module } from '@nestjs/common';
import { EnumeratorService } from './enumerator.service';
import { EnumeratorController } from './enumerator.controller';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [EnumeratorController],
  providers: [EnumeratorService],
})
export class EnumeratorModule {}
