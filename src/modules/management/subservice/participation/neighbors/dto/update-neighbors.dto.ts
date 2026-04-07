import { PartialType } from '@nestjs/mapped-types';
import { CreateNeighborsDto } from './create-neighbors.dto';

export class UpdateNeighborsDto extends PartialType(CreateNeighborsDto) {}
