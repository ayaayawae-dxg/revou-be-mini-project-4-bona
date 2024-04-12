import { ResultSetHeader, RowDataPacket } from "mysql2";
import { PoolConnection } from "mysql2/promise";

import { createError } from "../../common/createError";
import { UserModel } from "../user/user.model";

const checkUsername = async (connection: PoolConnection, username: string) => {
  const [rows] = await connection.query<RowDataPacket[]>(
    `SELECT username FROM users WHERE username = "${username}"`
  );
  if (rows.length > 0) {
    createError({ message: "Username already registered", status: 409 });
  }
};

const createUser = async (connection: PoolConnection, userModel: UserModel) => {
  const { username, password, fullname } = userModel;

  const query = `INSERT INTO users (username, password, fullname) VALUES ("${username}", "${password}", "${fullname}")`;
  const [rows] = await connection.query<ResultSetHeader>(query);

  if (rows.affectedRows === 0) {
    createError({ message: "Failed on insert user", status: 500 });
  }
};

export default {
  checkUsername,
  createUser,
};
