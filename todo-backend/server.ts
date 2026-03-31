import express, { Application } from "express";
import cors from "cors";
import todoRoutes from "./routes/todoRoutes.js";
import dotenv from "dotenv";

const app: Application = express();
dotenv.config();

app.use(cors());
app.use(express.json());

app.use(cors({
  origin: "*"
}));

app.use("/api/todos", todoRoutes);

const PORT: number = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});