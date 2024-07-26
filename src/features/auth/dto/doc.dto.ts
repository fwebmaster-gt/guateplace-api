import { ApiProperty } from "@nestjs/swagger";

export class UserInterface {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  lastname: string;

  @ApiProperty()
  is_active: boolean;
}

export class AuthResponseDto {
  @ApiProperty({ type: UserInterface })
  user: UserInterface;

  @ApiProperty()
  token: string;
}
