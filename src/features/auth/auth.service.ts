import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { PrismaService } from "src/database/prisma/prisma.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async profile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { uuid: userId },
      include: {
        plan: true,
        permissions: { include: { company: true, role: true } },
      },
    });

    const { password, planId, id, uuid, ...restUser } = user;

    return {
      id: user.uuid,
      ...restUser,
    };
  }

  async signIn(login: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: login.email },
      include: {
        plan: true,
        permissions: { include: { company: true, role: true } },
      },
    });

    if (!user) throw new HttpException("user not found", HttpStatus.NOT_FOUND);

    this.comparePassword(login.password, user.password);

    const { password, planId, id, uuid, ...restUser } = user;

    return {
      user: { id: user.uuid, ...restUser },
      token: this.generateToken(user.uuid + ""),
    };
  }

  async signUp(register: RegisterDto) {
    const userExist = await this.prisma.user.findUnique({
      where: { email: register.email },
      include: {
        plan: true,
        permissions: { include: { company: true, role: true } },
      },
    });

    if (userExist)
      throw new HttpException("user already registered", HttpStatus.CONFLICT);

    const user = await this.prisma.user.create({
      data: {
        ...register,
        password: this.encryptPassword(register.password),
      },
    });

    const { password, planId, id, uuid, ...restUser } = user;

    return {
      user: { id: user.uuid, ...restUser },
      token: this.generateToken(user.uuid + ""),
    };
  }

  //* HELPERS */

  private encryptPassword(password: string) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  }

  private comparePassword(password: string, hash: string) {
    const res = bcrypt.compareSync(password, hash);

    if (!res)
      throw new HttpException("invalid password", HttpStatus.UNAUTHORIZED);

    return res;
  }

  private generateToken(id: string) {
    return this.jwtService.sign({ id });
  }
}
