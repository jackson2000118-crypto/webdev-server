import type { Express } from "express";

export default function WorkingWithRemoteObjects(app: Express) {
  // In-memory state: survives a browser refresh, resets on server restart.
  const assignment = {
    id: 1,
    title: "NodeJS Assignment",
    description: "Create a NodeJS server with ExpressJS",
    due: "2021-10-10",
    completed: false,
    score: 0,
  };
  const module = {
    id: "M101",
    name: "Introduction to Node.js",
    description: "Learn Express HTTP routes",
    course: "CS5610",
  };
  app.get("/lab5/assignment", (_req, res) => {
    res.json(assignment);
  });
  app.get("/lab5/assignment/title", (_req, res) => {
    res.json(assignment.title);
  });
  app.get("/lab5/assignment/title/:newTitle", (req, res) => {
    assignment.title = req.params.newTitle;
    res.json(assignment);
  });
  // §5.2.3.4 On your own: assignment score and completed.
  app.get("/lab5/assignment/score/:score", (req, res) => {
    const score = Number(req.params.score);
    if (!req.params.score.trim() || !Number.isFinite(score)) {
      res.status(400).json({ message: "Invalid score" });
      return;
    }
    assignment.score = score;
    res.json(assignment);
  });
  app.get("/lab5/assignment/completed/:completed", (req, res) => {
    if (!["true", "false"].includes(req.params.completed)) {
      res.status(400).json({ message: "Completed must be true or false" });
      return;
    }
    assignment.completed = req.params.completed === "true";
    res.json(assignment);
  });
  // §5.2.3.4 On your own + With AI URL checklist in CHECKLIST.md.
  app.get("/lab5/module", (_req, res) => {
    res.json(module);
  });
  app.get("/lab5/module/name", (_req, res) => {
    res.json(module.name);
  });
  app.get("/lab5/module/name/:name", (req, res) => {
    module.name = req.params.name;
    res.json(module);
  });
  app.get("/lab5/module/description/:description", (req, res) => {
    module.description = req.params.description;
    res.json(module);
  });
}
