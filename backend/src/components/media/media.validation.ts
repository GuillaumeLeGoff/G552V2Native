import { IsString, IsNotEmpty, IsOptional, IsInt, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

class MediaDto {
  @IsInt()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  original_file_name: string;

  @IsString()
  @IsNotEmpty()
  file_name: string;

  @IsString()
  @IsNotEmpty()
  path: string;

  @IsString()
  @IsNotEmpty()
  format: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsOptional()
  thumbnail_path?: string;

  @IsString()
  @IsOptional()
  thumbnail_name?: string;

  @IsInt()
  @IsNotEmpty()
  size: number;

  @IsString()
  @IsNotEmpty()
  uploaded_at: string;

  @IsInt()
  @IsNotEmpty()
  user_id: number;

  @IsInt()
  @IsOptional()
  folder_id?: number;
}

export class CreateMediaDto {
  @ValidateNested()
  @Type(() => MediaDto)
  media: MediaDto;
}

export class UpdateMediaDto {

  @IsString()
  @IsOptional()
  file_name?: string;

  @IsInt()
  @IsOptional()
  folder_id?: number;
}