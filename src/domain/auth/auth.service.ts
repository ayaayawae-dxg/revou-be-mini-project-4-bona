import { compare, hash } from "bcrypt";
import { sign } from "jsonwebtoken";
import { PoolConnection } from "mysql2/promise";

import {
  CreateUserRequest,
  CreateUserResponse,
  LoginRequest,
  LoginResponse,
} from "./auth.model";
import authRepository from "./auth.repository";
import config from "../../config/config";
import { createError } from "../../common/createError";

const register = async (
  connection: PoolConnection,
  createUserRequest: CreateUserRequest
): Promise<CreateUserResponse> => {
  const { fullname, password, username, role } = createUserRequest;

  await authRepository.checkUsername(connection, username);

  const hashedPassword = await hash(password, 10);
  await authRepository.createUser(connection, {
    id: 0,
    fullname,
    password: hashedPassword,
    username,
    role,
  });

  const jwtToken = sign(
    { fullname, username, role },
    config.jwt_secret as string,
    { expiresIn: "1d" }
  );

  return { token: jwtToken };
};

const login = async (
  connection: PoolConnection,
  loginRequest: LoginRequest
): Promise<LoginResponse> => {
  const { password, username } = loginRequest;

  const userData = await authRepository.getUserByUsername(connection, username);
  const verifyPassword = await compare(password, userData.password);

  if (!verifyPassword) {
    createError({ status: 200, message: "Login Failed" });
  }

  const jwtToken = sign(
    {
      id: userData.id,
      fullname: userData.fullname,
      username: userData.username,
      role: userData.role,
    },
    config.jwt_secret as string,
    { expiresIn: "1d" }
  );

  return { token: jwtToken };
};

export default {
  register,
  login,
};
