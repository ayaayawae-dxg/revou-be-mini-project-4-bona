import { ResultSetHeader, RowDataPacket } from "mysql2";
import { createError } from "../../common/createError";
import pool from "../../config/db";
import { UserModel } from "../user/user.model";

const checkUsername = async (username: string) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT username FROM users WHERE username = "${username}"`
  );
  if (rows.length > 0) {
    createError({ message: "Username already registered", status: 409 });
  }
};

const createUser = async (userModel: UserModel) => {
  const { username, password, fullname } = userModel;
  const query = `INSERT INTO users (username, password, fullname) VALUES ("${username}", "${password}", "${fullname}")`;
  const [rows] = await pool.query<ResultSetHeader>(query);
  if (rows.affectedRows === 0) {
    createError({ message: "Failed on insert user", status: 500 });
  }
};

export default {
  checkUsername,
  createUser,
};
