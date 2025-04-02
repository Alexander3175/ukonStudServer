import { IsString, IsEmail, IsNotEmpty, IsArray } from 'class-validator';

export default class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  username?: string;

  @IsEmail()
  @IsNotEmpty()
  email?: string;

  @IsArray()
  @IsString({ each: true })
  roles: string[];
}
