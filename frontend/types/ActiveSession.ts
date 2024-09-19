import { User } from './User';

export interface ActiveSession {
  id: number;
  user_id: number | null;
  active_token: string | null;
  last_activity: Date | null;
  user?: User | null;
}