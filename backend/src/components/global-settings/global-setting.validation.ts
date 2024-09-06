import { IsBoolean, IsInt, IsNotEmpty } from "class-validator";

export class CreateGlobalSettingDto {
  @IsNotEmpty()
  @IsBoolean()
  public standby: boolean;

  @IsNotEmpty()
  @IsInt()
  public restart_at: number;

  @IsNotEmpty()
  @IsInt()
  public standby_start_time: number;

  @IsNotEmpty()
  @IsInt()
  public standby_end_time: number;
}