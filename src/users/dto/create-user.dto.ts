import { IsString, IsEmail, IsNotEmpty, IsArray } from 'class-validator';

export default class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsArray()
  @IsString({ each: true })
  roles: string[];
}
