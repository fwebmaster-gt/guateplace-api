import { Module } from "@nestjs/common";
import { UploadService } from "src/upload/upload.service";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

@Module({
  controllers: [UsersController],
  providers: [UsersService, UploadService],
})
export class UsersModule {}
