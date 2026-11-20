import type { Express, Request, Response } from "express";

type Todo = {
  id: number;
  title: string;
  completed: boolean;
  description?: string;
};
export default function WorkingWithRemoteArrays(app: Express) {
  let todos: Todo[] = [
    { id: 1, title: "Task 1", completed: false },
    { id: 2, title: "Task 2", completed: true },
    { id: 3, title: "Task 3", completed: false },
    { id: 4, title: "Task 4", completed: true },
  ];
  let lastId = Date.now();
  const nextId = () => {
    lastId = Math.max(Date.now(), lastId + 1);
    return lastId;
  };
  const findTodo = (req: Request, res: Response, verb: string) => {
    const todo = todos.find((t) => t.id === Number(req.params.id));
    if (!todo) {
      res
        .status(404)
        .json({ message: `Unable to ${verb} Todo with ID ${req.params.id}` });
    }
    return todo;
  };
  const getTodos = (req: Request, res: Response) => {
    const { completed } = req.query;
    res.json(
      completed === undefined
        ? todos
        : todos.filter((t) => t.completed === (completed === "true")),
    );
  };
  const createNewTodo = (_req: Request, res: Response) => {
    todos.push({ id: nextId(), title: "New Task", completed: false });
    res.json(todos);
  };
  const removeTodo = (req: Request, res: Response) => {
    const todo = findTodo(req, res, "delete");
    if (!todo) {
      return;
    } // Never splice(-1, 1): it would delete the wrong item.
    todos = todos.filter((t) => t.id !== todo.id);
    res.json(todos);
  };
  const updateTodoTitle = (req: Request, res: Response) => {
    const todo = findTodo(req, res, "update");
    if (!todo) {
      return;
    }
    todo.title = String(req.params.title);
    res.json(todos);
  };
  // §5.2.4.7 On your own
  const updateTodoCompleted = (req: Request, res: Response) => {
    const todo = findTodo(req, res, "update");
    if (!todo) {
      return;
    }
    if (!["true", "false"].includes(String(req.params.completed))) {
      res.status(400).json({ message: "Completed must be true or false" });
      return;
    }
    todo.completed = req.params.completed === "true";
    res.json(todos);
  };
  const updateTodoDescription = (req: Request, res: Response) => {
    const todo = findTodo(req, res, "update");
    if (!todo) {
      return;
    }
    todo.description = String(req.params.description);
    res.json(todos);
  };
  const postNewTodo = (req: Request, res: Response) => {
    const body = req.body;
    if (
      !body ||
      typeof body.title !== "string" ||
      typeof body.completed !== "boolean"
    ) {
      res
        .status(400)
        .json({ message: "A title and boolean completed are required" });
      return;
    }
    const todo: Todo = {
      id: nextId(),
      title: body.title,
      completed: body.completed,
    };
    if (typeof body.description === "string") {
      todo.description = body.description;
    }
    todos.push(todo);
    res.json(todo);
  };
  const deleteTodo = (req: Request, res: Response) => {
    const todo = findTodo(req, res, "delete");
    if (!todo) {
      return;
    }
    todos = todos.filter((t) => t.id !== todo.id);
    res.sendStatus(200);
  };
  const updateTodo = (req: Request, res: Response) => {
    const todo = findTodo(req, res, "update");
    if (!todo) {
      return;
    }
    const body = req.body;
    if (
      !body ||
      (body.title !== undefined && typeof body.title !== "string") ||
      (body.completed !== undefined && typeof body.completed !== "boolean") ||
      (body.description !== undefined && typeof body.description !== "string")
    ) {
      res.status(400).json({ message: "Invalid todo fields" });
      return;
    }
    // Keep the ID stable; editing is UI state, not server data.
    if (body.title !== undefined) {
      todo.title = body.title;
    }
    if (body.completed !== undefined) {
      todo.completed = body.completed;
    }
    if (body.description !== undefined) {
      todo.description = body.description;
    }
    res.sendStatus(200);
  };
  app.get("/lab5/todos", getTodos);
  // The literal /create MUST appear before /:id.
  app.get("/lab5/todos/create", createNewTodo);
  app.get("/lab5/todos/:id", (req, res) => {
    const todo = findTodo(req, res, "find");
    if (todo) {
      res.json(todo);
    }
  });
  // Keep the earlier GET teaching routes alongside POST / PUT / DELETE.
  app.get("/lab5/todos/:id/delete", removeTodo);
  app.get("/lab5/todos/:id/title/:title", updateTodoTitle);
  app.get("/lab5/todos/:id/completed/:completed", updateTodoCompleted);
  app.get("/lab5/todos/:id/description/:description", updateTodoDescription);
  app.post("/lab5/todos", postNewTodo);
  app.delete("/lab5/todos/:id", deleteTodo);
  app.put("/lab5/todos/:id", updateTodo);
}
