export interface User {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  city: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}