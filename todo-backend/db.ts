import mysql, { Connection } from "mysql2";

const db: Connection = mysql.createConnection({
  host: process.env.DB_HOST!,
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_NAME!,
});

db.connect((err: mysql.QueryError | null) => {
  if (err) {
    console.error("DB connection failed", err);
    return;
  }
  console.log("MySQL Connected");
});

export default db;
