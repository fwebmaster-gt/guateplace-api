import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class LoginDto {
  @ApiProperty()
  @IsEmail(undefined, { message: "invalid email" })
  @IsNotEmpty({ message: "email is required" })
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: "password is required" })
  @MinLength(6, { message: "password minimum length 6 characters" })
  password: string;
}
