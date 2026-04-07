import { PartialType } from '@nestjs/mapped-types';
import { CreateChargesDto } from './create-charges.dto';

export class UpdateChargesDto extends PartialType(CreateChargesDto) {}
