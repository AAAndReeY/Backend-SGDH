import { PartialType } from '@nestjs/mapped-types';
import { CreateBenefitedDto } from './create-benefited.dto';

export class UpdateBenefitedDto extends PartialType(CreateBenefitedDto) {}
