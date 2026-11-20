import type { Express } from "express";

export default function QueryParameters(app: Express) {
  app.get("/lab5/calculator", (req, res) => {
    const a = parseInt(String(req.query.a), 10);
    const b = parseInt(String(req.query.b), 10);
    if (!Number.isFinite(a) || !Number.isFinite(b)) {
      res.status(400).send("Invalid numbers");
      return;
    }
    let result: number;
    switch (req.query.operation) {
      case "add":
        result = a + b;
        break;
      case "subtract":
        result = a - b;
        break;
      // §5.2.2.3 On your own
      case "multiply":
        result = a * b;
        break;
      case "divide":
        if (b === 0) {
          res.status(400).send("Cannot divide by zero");
          return;
        }
        result = a / b;
        break;
      default:
        res.status(400).send("Invalid operation");
        return;
    }
    res.send(result.toString());
  });
}
