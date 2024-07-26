import { Module } from "@nestjs/common";
import { UploadService } from "src/upload/upload.service";
import { CompaniesController } from "./companies.controller";
import { CompaniesService } from "./companies.service";

@Module({
  controllers: [CompaniesController],
  providers: [CompaniesService, UploadService],
})
export class CompaniesModule {}
