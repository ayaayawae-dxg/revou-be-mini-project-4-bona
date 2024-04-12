import "dotenv/config";
import express from "express";
import { RowDataPacket } from "mysql2";

import routes from "./routes";
import log from "./middleware/log";
import { errorRes } from "./common/response";
import pool from "./config/db";
import config from "./config/config";

const app = express();

app.use(express.json());
app.use(log);

app.use("/", routes);

app.use(errorRes);

const checkDb = async () => {
  const [rows] = await pool.query<RowDataPacket[]>('select @@version'); 
  if (rows.length > 0) {
    console.log(`Database connected successfully`);
  } else {
    throw new Error("Failed to connect Database")
  }
}

const start = async () => {
  try {
    await checkDb()

    app.listen(config.port as number, config.host, () => {
      console.log(`Server is running on ${config.host}:${config.port}`);
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
