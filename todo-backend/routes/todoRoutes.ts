import express, { Request, Response } from "express";
import db from "../db.js";
import { QueryError, RowDataPacket, ResultSetHeader } from "mysql2";

const router = express.Router();

// GET TODOS
router.get("/", (req: Request, res: Response) => {
  db.query("SELECT * FROM todos", (err: QueryError | null, result: RowDataPacket[]) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// UPDATE TODO
router.put("/complete/:id", (req, res) => {
  db.query(
    "UPDATE todos SET isComplete = NOT isComplete WHERE id = ?",
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);

      db.query(
        "SELECT isComplete FROM todos WHERE id = ?",
        [req.params.id],
        (err, result) => {
          if (err) return res.status(500).json(err);

          res.json({ isComplete: result[0].isComplete });
        }
      );
    }
  );
});

// ADD TODO
router.post("/", (req: Request, res: Response) => {
  const { text } = req.body;

  db.query(
    "INSERT INTO todos (text) VALUES (?)",
    [text],
    (err: QueryError | null, result: ResultSetHeader) => {
      if (err) return res.status(500).json(err);
      res.json({ id: result.insertId, text });
    }
  );
});

// DELETE TODO
router.delete("/:id", (req: Request, res: Response) => {
  db.query(
    "DELETE FROM todos WHERE id = ?",
    [req.params.id],
    (err: QueryError | null) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Deleted" });
    }
  );
});

export default router;