import type { Express } from "express";

export default function Hello(app: Express) {
  app.get("/hello", (_req, res) => {
    res.send("Life is good!");
  });
  // §5.1.6 On your own + With AI; moved here in §5.1.8.
  app.get("/", (_req, res) => {
    res.send("Welcome to Full Stack Development!");
  });
}
