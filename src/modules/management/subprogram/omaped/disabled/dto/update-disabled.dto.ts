import { PartialType } from '@nestjs/mapped-types';
import { CreateDisabledDto } from './create-disabled.dto';

export class UpdateDisabledDto extends PartialType(CreateDisabledDto) {}
