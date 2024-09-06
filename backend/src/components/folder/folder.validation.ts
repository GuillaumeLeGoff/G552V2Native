import { IsNotEmpty, IsString, IsOptional, IsInt } from "class-validator";

export class CreateFolderDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsInt()
  parent_id?: number;
}
