import {
  Civil,
  Doctype,
  Health,
  Level,
  Living,
  Mode,
  Sex,
  Dificulty,
  Violenceby,
  Violencetype,
} from '@prisma/client';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
  IsNumber,
  IsDateString,
  IsUUID,
} from 'class-validator';

export class CreateBenefitedDto {
  @IsString()
  doc_num: string;

  @IsString()
  name: string;

  @IsString()
  lastname: string;

  @IsInt()
  @IsOptional()
  children?: number;

  @IsString()
  address: string;

  @IsString()
  @IsOptional()
  cellphone?: string;

  @IsString()
  @IsOptional()
  telephone?: string;

  @IsInt()
  @IsOptional()
  assessment_cognitive?: number;

  @IsInt()
  @IsOptional()
  assessment_emotional?: number;

  @IsInt()
  @IsOptional()
  assessment_functional?: number;

  @IsInt()
  @IsOptional()
  assessment_sociofamily?: number;

  @IsBoolean()
  @IsOptional()
  read_write?: boolean;

  @IsString()
  @IsOptional()
  profession?: string;

  @IsString()
  @IsOptional()
  housing_onservation?: string;

  @IsBoolean()
  @IsOptional()
  state_services?: boolean;

  @IsBoolean()
  @IsOptional()
  pension_65?: boolean;

  @IsBoolean()
  @IsOptional()
  onp?: boolean;

  @IsBoolean()
  @IsOptional()
  police_pension?: boolean;

  @IsString()
  @IsOptional()
  other_pension?: string;

  @IsBoolean()
  @IsOptional()
  sisfoh?: boolean;

  @IsBoolean()
  @IsOptional()
  works?: boolean;

  @IsString()
  @IsOptional()
  occupation_type?: string;

  @IsString()
  @IsOptional()
  occupation_other?: string;

  @IsNumber()
  @IsOptional()
  monthly_income?: number;

  @IsString()
  @IsOptional()
  other_income?: string;

  @IsString()
  @IsOptional()
  income_source?: string;

  @IsNumber()
  @IsOptional()
  income_amount?: number;

  @IsBoolean()
  @IsOptional()
  health_problem?: boolean;

  @IsString()
  @IsOptional()
  health_condition?: string;

  @IsBoolean()
  @IsOptional()
  treatment?: boolean;

  @IsBoolean()
  @IsOptional()
  conadis?: boolean;

  @IsOptional()
  disability_vision?: Dificulty;

  @IsOptional()
  disability_hearing?: Dificulty;

  @IsOptional()
  disability_walking?: Dificulty;

  @IsOptional()
  disability_memory?: Dificulty;

  @IsOptional()
  disability_selfcare?: Dificulty;

  @IsOptional()
  disability_communication?: Dificulty;

  @IsOptional()
  violence_by?: Violenceby;

  @IsOptional()
  violence_type?: Violencetype;

  @IsBoolean()
  @IsOptional()
  abused?: boolean;

  @IsString()
  @IsOptional()
  abuse_type?: string;

  @IsString()
  @IsOptional()
  registration_reason?: string;

  @IsString()
  @IsOptional()
  registration_reason_old?: string;

  @IsString()
  @IsOptional()
  expected_services?: string;

  @IsDateString()
  @IsOptional()
  birthday?: Date;

  @IsDateString()
  registered_at: Date;

  @IsDateString()
  @IsOptional()
  enrollmented_at?: Date;

  @IsUUID()
  country_id: string;

  @IsUUID()
  @IsOptional()
  department_birth_id?: string;

  @IsUUID()
  @IsOptional()
  department_live_id?: string;

  @IsUUID()
  education_id: string;

  @IsUUID()
  @IsOptional()
  ethnic_id?: string;

  @IsUUID()
  housing_id: string;

  @IsUUID()
  @IsOptional()
  language_learned_id?: string;

  @IsUUID()
  @IsOptional()
  language_native_id?: string;

  @IsUUID()
  @IsOptional()
  district_live_id?: string;

  @IsUUID()
  @IsOptional()
  province_birth_id?: string;

  @IsUUID()
  @IsOptional()
  province_live_id?: string;

  civil: Civil;

  @IsOptional()
  doc_type?: Doctype;

  @IsOptional()
  health?: Health;

  @IsOptional()
  poverty_level?: Level;

  @IsOptional()
  housing_status?: Living;

  @IsOptional()
  mode?: Mode;

  sex: Sex;
}
