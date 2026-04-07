import { PartialType } from '@nestjs/mapped-types';
import { CreateSupDto } from './create-sup.dto';

export class UpdateSupDto extends PartialType(CreateSupDto) {}