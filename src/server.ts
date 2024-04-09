import "dotenv/config";
import express from "express";

import routes from "./routes";
import log from "./middleware/log";
import { errorRes } from "./common/response";
import config from "./config/config";

const app = express();

app.use(express.json());
app.use(log);

app.use("/", routes);

app.use(errorRes);

const start = () => {
  try {
    app.listen(config.port as number, config.host, () => {
      console.log(`Server is running on ${config.host}:${config.port}`);
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
