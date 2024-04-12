export interface CreateUserRequest {
  username: string;
  password: string;
  fullname: string;
  role: string;
}

export interface CreateUserResponse {
  token: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string
}