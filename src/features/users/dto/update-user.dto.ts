import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, Min } from "class-validator";

export class UpdateUserDto {
  @ApiProperty()
  name?: string;

  @ApiProperty()
  lastname?: string;

  @ApiProperty()
  state?: string;

  @ApiProperty()
  city?: string;

  @ApiProperty()
  allow_notifications?: boolean;
}

export class UpdateUserPasswordDto {
  @ApiProperty()
  @IsNotEmpty({ message: "Current password is required" })
  currentPassword: string;

  @IsNotEmpty({ message: "New password is required" })
  @Min(6, { message: "6 characters minimum" })
  @ApiProperty()
  newPassword: string;
}
