import { IsNotEmpty, IsString } from "class-validator";

export class CreateButtonDto {
  @IsNotEmpty()
  @IsString()
  public name: string;
}
