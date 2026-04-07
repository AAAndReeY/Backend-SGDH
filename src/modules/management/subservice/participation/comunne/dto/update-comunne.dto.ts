import { PartialType } from '@nestjs/mapped-types';
import { CreateComunneDto } from './create-comunne.dto';

export class UpdateComunneDto extends PartialType(CreateComunneDto) {}
