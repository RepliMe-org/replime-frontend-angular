export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  role: string;
}

export interface UserInfo {
  username: string;
  role: string;
}

export interface AuthFormSubmitEvent {
  name?: string;
  email: string;
  password: string;
  isLoginMode: boolean;
}
