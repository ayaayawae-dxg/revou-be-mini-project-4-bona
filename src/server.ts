import "dotenv/config";
import express from "express";
import { RowDataPacket } from "mysql2";
import * as OpenApiValidator from "express-openapi-validator";
import path from "path";

import routes from "./routes";
import log from "./middleware/log";
import { errorRes } from "./common/response";
import pool from "./config/db";
import config from "./config/config";

const app = express();
const apiSpec = path.join(__dirname, '../api.yaml');

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: false }));
app.use(log);
app.use(
  OpenApiValidator.middleware({
    apiSpec,
    validateRequests: true, // (default)
    validateResponses: true, // false by default
  }),
);
app.use('/spec', express.static(apiSpec));

app.use("/", routes);

app.use(errorRes);

const checkDb = async () => {
  const [rows] = await pool.query<RowDataPacket[]>("select @@version");
  if (rows.length > 0) {
    console.log(`Database connected successfully`);
  } else {
    throw new Error("Failed to connect Database");
  }
};

const start = async () => {
  try {
    await checkDb();

    app.listen(config.port as number, config.host, () => {
      console.log(`Server is running on ${config.host}:${config.port}`);
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
