import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class CreateMacroDto {
  @IsNotEmpty()
  @IsNumber()
  public playlist_id: number;

  @IsNotEmpty()
  @IsNumber()
  public button_id: number;

  @IsNotEmpty()
  @IsNumber()
  public user_id: number;
}

export class UpdateMacroDto {

  @IsOptional()
  @IsNumber()
  public playlistId?: number;

  @IsOptional()
  @IsNumber()
  public buttonId?: number;
}