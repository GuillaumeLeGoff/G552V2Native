interface User {
  id: number;
  username: string;
  password: string;
  role: string;
  first_login: boolean;
  active_token: string | null;
  event_auto: boolean;
  language: string | null;
}
