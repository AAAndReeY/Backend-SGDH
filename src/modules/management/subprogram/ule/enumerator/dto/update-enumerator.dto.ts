import { PartialType } from '@nestjs/mapped-types';
import { CreateEnumeratorDto } from './create-enumerator.dto';

export class UpdateEnumeratorDto extends PartialType(CreateEnumeratorDto) {}
