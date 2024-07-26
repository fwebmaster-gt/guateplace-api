import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class RegisterDto {
  @ApiProperty({ description: "Unique email for account registration" })
  @IsEmail(undefined, { message: "invalid email" })
  @IsNotEmpty({ message: "email is required" })
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: "password is required" })
  @MinLength(6, { message: "password minimum length 6 characters" })
  password: string;

  @ApiProperty()
  @IsNotEmpty({ message: "user name is required" })
  name: string;

  @ApiProperty()
  lastname?: string;
}
