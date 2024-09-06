import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class CreatePlaylistMediaDto {
  @IsOptional()
  @IsNumber()
  public media_id: number;

  @IsNotEmpty()
  @IsNumber()
  public playlist_id: number;

  @IsNotEmpty()
  @IsNumber()
  public media_dur_in_playlist: number;

  @IsNotEmpty()
  @IsNumber()
  public media_pos_in_playlist: number;
}

export class UpdatePlaylistMediaDto {
  @IsOptional()
  @IsNumber()
  public media_dur_in_playlist?: number;

  @IsOptional()
  @IsNumber()
  public media_pos_in_playlist?: number;
}
