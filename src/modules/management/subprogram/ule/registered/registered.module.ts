import { Module } from '@nestjs/common';
import { RegisteredService } from './registered.service';
import { RegisteredController } from './registered.controller';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [RegisteredController],
  providers: [RegisteredService],
})
export class RegisteredModule {}
