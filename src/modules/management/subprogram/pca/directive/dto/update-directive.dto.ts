import { PartialType } from '@nestjs/mapped-types';
import { CreateDirectiveDto } from './create-directive.dto';

export class UpdateDirectiveDto extends PartialType(CreateDirectiveDto) {}
