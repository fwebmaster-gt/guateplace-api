import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  const docConfig = new DocumentBuilder()
    .setTitle("Guate API Documentation")
    .setDescription("Created with NestJs")
    .setVersion("1.0")
    .build();

  const document = SwaggerModule.createDocument(app, docConfig);

  SwaggerModule.setup("documentation", app, document);

  await app.listen(process.env.PORT || 4000);
}
bootstrap();
