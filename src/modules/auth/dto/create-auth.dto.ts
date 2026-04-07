import { IsString, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsString()
  name: string;

  @IsString()
  lastname: string;

  @IsEmail()
  email: string;
}