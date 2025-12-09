import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignUpDto {
  @ApiProperty({ example: 'johndoe', description: 'The unique username of the user' })
  @IsString()
  @IsNotEmpty()
  @Expose()
  userName: string;

  @ApiProperty({ example: 'john@example.com', description: 'The unique email of the user' })
  @IsEmail()
  @IsNotEmpty()
  @Expose()
  email: string;

  @ApiProperty({ example: 'password123', description: 'The password of the user' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Expose()
  password: string;
}
