import "dotenv/config";
import express from "express";
import cors from "cors";
import session, { type SessionOptions } from "express-session";
import Hello from "./Hello";
import Lab5 from "./Lab5/index";
import db from "./Kambaz/Database";
import UserRoutes from "./Kambaz/Users/routes";
import CourseRoutes from "./Kambaz/Courses/routes";
import EnrollmentRoutes from "./Kambaz/Enrollments/routes";
import ModuleRoutes from "./Kambaz/Modules/routes";

import AssignmentRoutes from "./Kambaz/Assignments/routes";

const app = express();

app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL || "http://localhost:3000"
  })
);

const sessionOptions: SessionOptions = {
  secret: process.env.SESSION_SECRET || "kambaz",
  resave: false,
  saveUninitialized: false
};

if (process.env.SERVER_ENV !== "development") {
  sessionOptions.proxy = true;
  sessionOptions.cookie = {
    sameSite: "none",
    secure: true
  };
}

app.use(session(sessionOptions));
app.use(express.json());

Hello(app);
Lab5(app);
UserRoutes(app, db);
CourseRoutes(app, db);
EnrollmentRoutes(app, db);
ModuleRoutes(app, db);
AssignmentRoutes(app, db);

const port = Number(process.env.PORT) || 4000;

app.listen(port, () => {
  console.log(`Express is running at http://localhost:${port}`);
});
