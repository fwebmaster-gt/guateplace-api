import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { User } from "../auth/auth.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CompaniesService } from "./companies.service";
import { CreateCompanyDto } from "./dto/create-company.dto";
import { UpdateCompanyDto } from "./dto/update-company.dto";

@Controller("companies")
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor("logo"))
  create(
    @User() user: any,
    @Body() createCompanyDto: CreateCompanyDto,
    @UploadedFile() logo?: Express.Multer.File
  ) {
    return this.companiesService.create(user.uuid, createCompanyDto, logo);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.companiesService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companiesService.update(+id, updateCompanyDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.companiesService.remove(+id);
  }
}
