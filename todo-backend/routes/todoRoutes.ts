import express, { Request, Response } from "express";
import db from "../db.js";
import { QueryError, RowDataPacket, ResultSetHeader } from "mysql2";

const router = express.Router();

// GET TODOS
// router.get("/", (req: Request, res: Response) => {
//   db.query(
//     "SELECT * FROM todos",
//     (err: QueryError | null, result: RowDataPacket[]) => {
//       if (err) return res.status(500).json(err);
//       res.json(result);
//     },
//   );
// });

router.get("/", (req, res) => {
  res.json([
    { id: 1, text: "Test todo", isComplete: false }
  ]);
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
        (err: QueryError | null, result: RowDataPacket[]) => {
          if (err) return res.status(500).json(err);

          //  ADD THIS CHECK
          if (!result || result.length === 0) {
            return res.status(404).json({ message: "Todo not found" });
          }

          //
          const row = result[0];

          if (!row) {
            return res.status(404).json({ message: "Todo not found" });
          }

          res.json({ isComplete: row.isComplete });
        },
      );
    },
  );
});

router.put("/:id", (req, res) => {
  const { text, isComplete } = req.body;
  const id = req.params.id;

  db.query(
    "UPDATE todos SET text = ?, isComplete = ? WHERE id = ?",
    [text, isComplete, id],
    (err) => {
      if (err) {
        console.log("Update error:", err);
        return res.status(500).json(err);
      }

      res.json({
        id: Number(id),
        text,
        isComplete,
      });
    },
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
    },
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
    },
  );
});

export default router;
