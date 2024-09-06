import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateScoringDto {

  @IsNotEmpty()
  @IsInt()
  public user_id: number;

  @IsInt()
  @IsOptional()
  public timer: number;

  @IsInt()
  @IsOptional()
  public score_team1: number;

  @IsInt()
  @IsOptional()
  public score_team2: number;

  @IsInt()
  @IsOptional()
  public faute_team1: number;

  @IsInt()
  @IsOptional()
  public faute_team2: number;

  @IsString()
  @IsOptional()
  public nom_team1: string;

  @IsString()
  @IsOptional()
  public nom_team2: string;

  @IsInt()
  @IsOptional()
  public option1: number;

  @IsInt()
  @IsOptional()
  public option2: number;

  @IsInt()
  @IsOptional()
  public option3: number;

  @IsInt()
  @IsOptional()
  public option4: number;

  @IsInt()
  @IsOptional()
  public option5: number;

  @IsInt()
  @IsOptional()
  public option6: number;

  @IsString()
  @IsOptional()
  public option7: string;

  @IsString()
  @IsOptional()
  public option8: string;
}

export class UpdateScoringDto {
  @IsNotEmpty()
  @IsInt()
  public user_id: number;

  @IsInt()
  @IsOptional()
  public timer: number;

  @IsInt()
  @IsOptional()
  public score_team1: number;

  @IsInt()
  @IsOptional()
  public score_team2: number;

  @IsInt()
  @IsOptional()
  public faute_team1: number;

  @IsInt()
  @IsOptional()
  public faute_team2: number;

  @IsString()
  @IsOptional()
  public nom_team1: string;

  @IsString()
  @IsOptional()
  public nom_team2: string;

  @IsInt()
  @IsOptional()
  public option1: number;

  @IsInt()
  @IsOptional()
  public option2: number;

  @IsInt()
  @IsOptional()
  public option3: number;

  @IsInt()
  @IsOptional()
  public option4: number;

  @IsInt()
  @IsOptional()
  public option5: number;

  @IsInt()
  @IsOptional()
  public option6: number;

  @IsString()
  @IsOptional()
  public option7: string;

  @IsString()
  @IsOptional()
  public option8: string;

}
