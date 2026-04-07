import { PartialType } from '@nestjs/mapped-types';
import { CreateUrbanDto } from './create-urban.dto';

export class UpdateUrbanDto extends PartialType(CreateUrbanDto) {}
