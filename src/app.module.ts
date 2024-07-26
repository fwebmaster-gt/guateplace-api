import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { PrismaModule } from "./database/prisma/prisma.module";
import { PrismaService } from "./database/prisma/prisma.service";
import { AuthModule } from "./features/auth/auth.module";
import { JwtStrategy } from "./features/auth/estrategies/jwt.strategy";
import { PlansModule } from "./features/plans/plans.module";
import { UsersModule } from "./features/users/users.module";
import { UploadModule } from "./upload/upload.module";
import { UploadService } from "./upload/upload.service";
import { CompaniesModule } from './features/companies/companies.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ".env" }),
    AuthModule,
    PrismaModule,
    UploadModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "uploads"),
      serveRoot: "/uploads",
    }),
    UsersModule,
    PlansModule,
    CompaniesModule,
  ],
  controllers: [],
  providers: [JwtStrategy, PrismaService, UploadService],
})
export class AppModule {}
