export interface Theme {
  id?: number;
  name: string;
  description: string | null;
  userEmail?: string;
  isSubscribed?: boolean;
}

export interface ThemeRequest {
  name: string;
  description: string | null;
}
