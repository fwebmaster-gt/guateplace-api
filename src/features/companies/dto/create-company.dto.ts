import { IsNotEmpty } from "class-validator";

export class CreateCompanyDto {
  @IsNotEmpty({ message: "Name is required" })
  name: string;

  description?: string;
}
