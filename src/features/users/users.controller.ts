import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiTags } from "@nestjs/swagger";
import { User as IUser } from "@prisma/client";
import { User } from "../auth/auth.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { UpdateUserDto, UpdateUserPasswordDto } from "./dto/update-user.dto";
import { UsersService } from "./users.service";

@ApiTags("Users")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Patch()
  @UseInterceptors(FileInterceptor("avatar"))
  update(
    @User() user: IUser,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() avatar?: Express.Multer.File
  ) {
    return this.usersService.update(user.uuid, updateUserDto, avatar);
  }

  @UseGuards(JwtAuthGuard)
  @Patch("password")
  updatePassword(
    @User() user: IUser,
    @Body() passwords: UpdateUserPasswordDto
  ) {
    return this.usersService.updatePassword(user.uuid, passwords);
  }

  @UseGuards(JwtAuthGuard)
  @Post("plan/:id")
  updatePlan(@User() user: IUser, @Param("id") planId: string) {
    return this.usersService.updatePlan(planId, user.uuid);
  }
}
