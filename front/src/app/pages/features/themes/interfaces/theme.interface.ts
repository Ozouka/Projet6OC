export interface Theme {
  id?: number;
  name: string;
  description: string | null;
  userEmail?: string;
  isSubscribed?: boolean;
  subscribed?: boolean;  // Alias pour isSubscribed utilisé par le backend
}

export interface ThemeRequest {
  name: string;
  description: string | null;
}
