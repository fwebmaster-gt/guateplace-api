import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { User as IUser } from "@prisma/client";
import { User } from "./auth.decorator";
import { AuthService } from "./auth.service";
import { AuthResponseDto } from "./dto/doc.dto";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("/signin")
  @ApiResponse({
    status: 200,
    description: "return a user with auth token",
    type: AuthResponseDto,
  })
  signIn(@Body() login: LoginDto) {
    return this.authService.signIn(login);
  }

  @Post("/signup")
  @ApiResponse({
    status: 200,
    description: "return a user with auth token",
    type: AuthResponseDto,
  })
  signUp(@Body() register: RegisterDto) {
    return this.authService.signUp(register);
  }

  @UseGuards(JwtAuthGuard)
  @Get("/session")
  @ApiResponse({
    status: 200,
    description: "return a current user with new auth token",
  })
  getProfile(@User() user: IUser) {
    return this.authService.profile(user.uuid);
  }
}
