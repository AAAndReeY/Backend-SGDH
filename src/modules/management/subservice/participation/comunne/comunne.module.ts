import { Module } from '@nestjs/common';
import { ComunneService } from './comunne.service';
import { ComunneController } from './comunne.controller';

@Module({
  controllers: [ComunneController],
  providers: [ComunneService],
})
export class ComunneModule {}
