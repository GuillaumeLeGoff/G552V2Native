import { User } from './User';

export interface Scoring {
  id: number;
  user_id: number;
  timer: number | null;
  score_team1: number | null;
  score_team2: number | null;
  faute_team1: number | null;
  faute_team2: number | null;
  nom_team1: string | null;
  nom_team2: string | null;
  option1: number | null;
  option2: number | null;
  option3: number | null;
  option4: number | null;
  option5: number | null;
  option6: number | null;
  option7: string | null;
  option8: string | null;
  user?: User;
}