import { PoolConnection } from "mysql2/promise";
import bcrypt from "bcrypt";
import authRepository from "./auth.repository";
import authService from "./auth.service";

jest.mock("./auth.repository", () => ({
  checkUsername: jest.fn(),
  createUser: jest.fn(),
  getUserByUsername: jest.fn(),
}));
jest.mock("../../config/config", () => ({
  jwt_secret: "test_secret_key",
}));

describe("auth service", () => {
  let connection: PoolConnection;

  beforeEach(() => {
    connection = {} as PoolConnection;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("should register a new user and return a token", async () => {
      const createUserRequest = {
        fullname: "Test User",
        password: "testpassword",
        username: "testuser",
        role: "user",
      };

      (authRepository.checkUsername as jest.Mock).mockResolvedValueOnce(null);
      (authRepository.createUser as jest.Mock).mockResolvedValueOnce(null);

      const result = await authService.register(connection, createUserRequest);

      expect(result.token).toBeDefined();
    });
  });

  describe("login", () => {
    it("should login a user with correct credentials and return a token", async () => {
      const loginRequest = {
        username: "testuser",
        password: "testpassword",
      };

      const userData = {
        id: 1,
        fullname: "Test User",
        password: "hashedpassword",
        username: "testuser",
        role: "user",
      };

      (authRepository.getUserByUsername as jest.Mock).mockResolvedValueOnce(userData);
      (jest.spyOn(bcrypt, "compare") as jest.Mock).mockResolvedValueOnce(true);

      const result = await authService.login(connection, loginRequest);

      expect(result.token).toBeDefined();
    });

    it("should throw an error for incorrect credentials", async () => {
      const loginRequest = {
        username: "testuser",
        password: "wrongpassword",
      };

      const userData = {
        id: 1,
        fullname: "Test User",
        password: "hashedpassword",
        username: "testuser",
        role: "user",
      };

      (authRepository.getUserByUsername as jest.Mock).mockResolvedValueOnce(userData);
      (jest.spyOn(bcrypt, "compare") as jest.Mock).mockResolvedValueOnce(false);

      await expect(authService.login(connection, loginRequest)).rejects.toThrow(
        "Login Failed"
      );
    });
  });
});
