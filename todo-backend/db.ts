import mysql, { Connection } from "mysql2";

const db: Connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "react_todo_app",
});

db.connect((err: mysql.QueryError | null) => {
  if (err) {
    console.error("DB connection failed", err);
    return;
  }
  console.log("MySQL Connected");
});

export default db;