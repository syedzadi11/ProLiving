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

export interface UserProfile {
  full_name: string;
  email: string;
  phone: string;
  city: string;
  profile_photo?: string | null;
}

export interface UserProfileResponse {
  user: UserProfile;
}