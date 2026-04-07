import { Module } from '@nestjs/common';
import { ObservationService } from './services/observation.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ObservationService],
  exports: [ObservationService],
})
export class CommonModule {}