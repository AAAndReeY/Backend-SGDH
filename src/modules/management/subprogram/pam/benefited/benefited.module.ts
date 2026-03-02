import { Module } from '@nestjs/common';
import { BenefitedService } from './benefited.service';
import { BenefitedController } from './benefited.controller';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [BenefitedController],
  providers: [BenefitedService],
})
export class BenefitedModule {}
