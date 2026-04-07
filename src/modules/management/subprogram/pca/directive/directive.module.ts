import { Module } from '@nestjs/common';
import { DirectiveService } from './directive.service';
import { DirectiveController } from './directive.controller';

@Module({
  controllers: [DirectiveController],
  providers: [DirectiveService],
})
export class DirectiveModule {}
