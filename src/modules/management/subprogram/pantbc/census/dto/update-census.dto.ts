import { PartialType } from '@nestjs/mapped-types';
import { CreateCensusDto } from './create-census.dto';

export class UpdateCensusDto extends PartialType(CreateCensusDto) {}
