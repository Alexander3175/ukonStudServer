import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export default class AuthPayloadDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
