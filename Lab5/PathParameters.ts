import type { Express, Request, Response } from "express";

export default function PathParameters(app: Express) {
  const calculate = (req: Request, res: Response, operation: string) => {
    // Like the chapter, these Express exercises use integer operands.
    const a = parseInt(String(req.params.a), 10);
    const b = parseInt(String(req.params.b), 10);
    if (!Number.isFinite(a) || !Number.isFinite(b)) {
      res.status(400).send("Invalid numbers");
      return;
    }
    let result: number;
    switch (operation) {
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
  };
  app.get("/lab5/add/:a/:b", (req, res) => calculate(req, res, "add"));
  app.get("/lab5/subtract/:a/:b", (req, res) =>
    calculate(req, res, "subtract"),
  );
  app.get("/lab5/multiply/:a/:b", (req, res) =>
    calculate(req, res, "multiply"),
  );
  app.get("/lab5/divide/:a/:b", (req, res) => calculate(req, res, "divide"));
}
