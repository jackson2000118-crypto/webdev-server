import type { Express, Request, Response } from "express";
import "express-session";
import type database from "../Database";
import UsersDao from "./dao";

type User = (typeof database.users)[number];

declare module "express-session" {
  interface SessionData {
    currentUser?: User;
  }
}

export default function UserRoutes(
  app: Express,
  db: typeof database
) {
  const dao = UsersDao(db);

  const signin = (req: Request, res: Response) => {
    const { username, password } = req.body;

    const currentUser = dao.findUserByCredentials(
      username,
      password
    );

    if (!currentUser) {
      res.status(401).json({
        message: "Invalid username or password.",
      });
      return;
    }

    req.session.currentUser = currentUser;

    res.json(currentUser);
  };

  const signup = (req: Request, res: Response) => {
    const user = dao.findUserByUsername(req.body.username);

    if (user) {
      res.status(400).json({
        message: "Username already in use",
      });
      return;
    }

    const currentUser = dao.createUser(req.body);

    req.session.currentUser = currentUser;

    res.json(currentUser);
  };

  const profile = (req: Request, res: Response) => {
    const currentUser = req.session.currentUser;

    if (!currentUser) {
      res.sendStatus(401);
      return;
    }

    res.json(currentUser);
  };

  const updateUser = (
    req: Request<{ userId: string }>,
    res: Response
  ) => {
    const { userId } = req.params;

    const user = dao.findUserById(userId);

    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }

    dao.updateUser(userId, req.body);

    const updatedUser = dao.findUserById(userId);

    if (req.session.currentUser?._id === userId) {
      req.session.currentUser = updatedUser;
    }

    res.json(updatedUser);
  };

  const signout = (req: Request, res: Response) => {
    req.session.destroy((error) => {
      if (error) {
        res.status(500).json({
          message: "Unable to sign out.",
        });
        return;
      }

      res.clearCookie("connect.sid");
      res.sendStatus(200);
    });
  };

  app.post("/api/users/signin", signin);
  app.post("/api/users/signup", signup);
  app.get("/api/users/profile", profile);
  app.put("/api/users/:userId", updateUser);
  app.post("/api/users/signout", signout);
}