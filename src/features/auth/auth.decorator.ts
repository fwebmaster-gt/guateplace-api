import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
} from "@nestjs/common";
import { PrismaService } from "src/database/prisma/prisma.service";

const prisma = new PrismaService();

export const User = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const user = await prisma.user.findUnique({
      where: { uuid: request.user.id },
    });

    if (!user) throw new HttpException("Invalid token", 400);

    return user;
  }
);
