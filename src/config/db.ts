import mysql from "mysql2/promise";
import config from "./config";

const pool = mysql.createPool({
  host: config.db_host,
  port: Number(config.db_port),
  user: config.db_user,
  database: config.db_name,
  password: config.db_password,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
  idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

export default pool;
