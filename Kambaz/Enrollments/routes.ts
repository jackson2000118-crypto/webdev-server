import type { Express, Request, Response } from "express";
import type database from "../Database";
import EnrollmentsDao from "./dao";

type EnrollmentParams = {
  uid: string;
  cid: string;
};

export default function EnrollmentRoutes(
  app: Express,
  db: typeof database
) {
  const dao = EnrollmentsDao(db);

  const enrollIntoCourse = (
    req: Request<EnrollmentParams>,
    res: Response
  ) => {
    const currentUser = req.session.currentUser;

    if (!currentUser) {
      res.sendStatus(401);
      return;
    }

    const userId =
      req.params.uid === "current"
        ? currentUser._id
        : req.params.uid;

    if (userId !== currentUser._id) {
      res.sendStatus(403);
      return;
    }

    const courseId = req.params.cid;

    const course = db.courses.find(
      (course) => course._id === courseId
    );

    if (!course) {
      res.status(404).json({
        message: "Course not found.",
      });
      return;
    }

    const enrollment = dao.enrollUserInCourse(
      userId,
      courseId
    );

    res.json(enrollment);
  };

  const unenrollFromCourse = (
    req: Request<EnrollmentParams>,
    res: Response
  ) => {
    const currentUser = req.session.currentUser;

    if (!currentUser) {
      res.sendStatus(401);
      return;
    }

    const userId =
      req.params.uid === "current"
        ? currentUser._id
        : req.params.uid;

    if (userId !== currentUser._id) {
      res.sendStatus(403);
      return;
    }

    dao.unenrollUserFromCourse(
      userId,
      req.params.cid
    );

    res.sendStatus(200);
  };

  app.post(
    "/api/users/:uid/courses/:cid",
    enrollIntoCourse
  );

  app.delete(
    "/api/users/:uid/courses/:cid",
    unenrollFromCourse
  );
}