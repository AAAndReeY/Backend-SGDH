import { IsOptional, IsUUID } from 'class-validator';
import { SearchDto } from '../../../../common/dto';

export class FilterModuleDto extends SearchDto {
  @IsOptional()
  @IsUUID()
  program: string;
}
