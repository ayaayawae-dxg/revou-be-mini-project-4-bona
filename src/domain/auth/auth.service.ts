import { hash } from "bcrypt";
import { sign } from "jsonwebtoken";

import { CreateUserRequest, CreateUserResponse } from "./auth.model";
import authRepository from "./auth.repository";
import config from "../../config/config";

const register = async (createUserRequest: CreateUserRequest): Promise<CreateUserResponse> => {
  const { fullname, password, username, role } = createUserRequest;

  await authRepository.checkUsername(username);

  const hashedPassword = await hash(password, 10);
  await authRepository.createUser({
    id: 0,
    fullname,
    password: hashedPassword,
    username,
    role,
  });

  const jwtToken = sign(
    { fullname, username, role },
    config.jwt_secret as string,
    { expiresIn: "1h" }
  );

  return { token: jwtToken };
};

export default {
  register,
};
