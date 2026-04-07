import { PartialType } from '@nestjs/mapped-types';
import { CreateEthnicDto } from './create-ethnic.dto';

export class UpdateEthnicDto extends PartialType(CreateEthnicDto) {}
