import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export default class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
