import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma/prisma.service";
import { UploadService } from "src/upload/upload.service";
import { CreateCompanyDto } from "./dto/create-company.dto";
import { UpdateCompanyDto } from "./dto/update-company.dto";

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService, private storage: UploadService) {}
  async create(
    userId: string,
    createCompanyDto: CreateCompanyDto,
    logo: Express.Multer.File
  ) {
    const image = logo ? await this.storage.uploadFile(logo) : null;

    const company = await this.prisma.company.create({
      data: {
        name: createCompanyDto.name,
        logo: image,
        description: createCompanyDto.description,
      },
    });

    const newRole = await this.prisma.role.create({
      data: {
        name: "Fundador",
        description: "Role para el creador del negocio",
        companyId: company.uuid,
      },
    });

    await this.prisma.companyPermission.create({
      data: {
        companyId: company.uuid,
        userId,
        roleId: newRole.uuid,
      },
    });

    return "This action adds a new company";
  }

  findOne(id: number) {
    return `This action returns a #${id} company`;
  }

  update(id: number, updateCompanyDto: UpdateCompanyDto) {
    return `This action updates a #${id} company`;
  }

  remove(id: number) {
    return `This action removes a #${id} company`;
  }
}
