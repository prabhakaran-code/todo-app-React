import express, { Application } from "express";
import cors from "cors";
import todoRoutes from "./routes/todoRoutes.js";
import dotenv from "dotenv";

const app: Application = express();
dotenv.config();

import db from "./db.js";

db.query(`
  CREATE TABLE IF NOT EXISTS todos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    text VARCHAR(255),
    isComplete BOOLEAN DEFAULT false
  )
`, (err) => {
  if (err) {
    console.log("❌ Table creation failed:", err);
  } else {
    console.log("✅ Table ready");
  }
});

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is working 🚀");
});

app.use(
  cors({
    origin: "*",
  }),
);

app.use("/api/todos", todoRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
