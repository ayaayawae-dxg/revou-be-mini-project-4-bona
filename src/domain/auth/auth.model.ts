export interface CreateUserRequest {
  username: string;
  password: string;
  fullname: string;
  role: string;
}

export interface CreateUserResponse {
  token: string;
}
