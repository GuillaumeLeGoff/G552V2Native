import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateModeDto {
  @IsString()
  @IsOptional()
  public mode?: string;

  @IsNumber()
  @IsOptional()
  public playlist_id?: number;
}

export class UpdateModeDto {
  @IsString()
  @IsOptional()
  public mode?: string;

  @IsNumber()
  @IsOptional()
  public playlist_id?: number;
}
