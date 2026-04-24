import { IsOptional, IsString } from 'class-validator';
import { SearchDto } from '../../../../../../common/dto';

export class FilterSupDto extends SearchDto {
  @IsOptional()
  @IsString()
  district?: string;

  @IsOptional()
  @IsString()
  populated?: string;

  @IsOptional()
  @IsString()
  dni?: string;
}