import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { PrismaService } from "src/database/prisma/prisma.service";
import { UploadService } from "src/upload/upload.service";
import { UpdateUserDto, UpdateUserPasswordDto } from "./dto/update-user.dto";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService, private storage: UploadService) {}

  async update(
    id: string,
    { city, lastname, name, state, allow_notifications }: UpdateUserDto,
    avatar?: Express.Multer.File
  ) {
    const image = avatar ? await this.storage.uploadFile(avatar) : null;

    const finalData = {
      city,
      lastname,
      name,
      state,
      allow_notifications,
    };

    return this.prisma.user.update({
      where: { uuid: id },
      data: image
        ? {
            avatar: image,
            ...finalData,
          }
        : finalData,
      include: { plan: true, permissions: true },
    });
  }

  async updatePassword(id: string, data: UpdateUserPasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { uuid: id } });

    const res = bcrypt.compareSync(data.currentPassword, user.password);

    if (!res)
      throw new HttpException("invalid password", HttpStatus.UNAUTHORIZED);

    await this.prisma.user.update({
      where: { uuid: id },
      data: {
        password: bcrypt.hashSync(data.newPassword, bcrypt.genSaltSync(10)),
      },
    });

    return res;
  }

  async updatePlan(planId: string, userId: string) {
    try {
      const plan = await this.prisma.plan.findUnique({
        where: { uuid: planId },
      });

      console.log(plan, planId);

      if (!plan) throw new HttpException("Plan not found", 404);

      return this.prisma.user.update({
        where: { uuid: userId },
        data: { planId: plan.uuid },
        include: { plan: true, permissions: true },
      });
    } catch (error) {
      console.log(error);
      throw new HttpException("Server error", 500);
    }
  }
}
