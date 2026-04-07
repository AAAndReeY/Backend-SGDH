import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { SearchDto } from '../../../../../../common/dto';
import { Transform } from 'class-transformer';

export class FilterSupDto extends SearchDto {
  @IsOptional()
  @IsString()
  district?: string;

  @IsOptional()
  @IsString()
  populated?: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  phone?: boolean;
}