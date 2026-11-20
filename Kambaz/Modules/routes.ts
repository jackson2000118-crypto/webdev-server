import type { Express, Request, Response } from "express";
import type database from "../Database";
import ModulesDao from "./dao";

export default function ModuleRoutes(app: Express, db: typeof database) {
  const dao = ModulesDao(db);

  const findModulesForCourse = (
    req: Request<{ courseId: string }>,
    res: Response
  ) => {
    res.json(dao.findModulesForCourse(req.params.courseId));
  };

  const createModuleForCourse = (
    req: Request<{ courseId: string }>,
    res: Response
  ) => {
    const { courseId } = req.params;
    const course = db.courses.find(
      (course) => course._id === courseId
    );

    if (!course) {
      res.status(404).json({ message: "Course not found." });
      return;
    }

    const name = req.body?.name;

    if (typeof name !== "string" || name.trim() === "") {
      res.status(400).json({ message: "Module name is required." });
      return;
    }

    const module = dao.createModule({
      name: name.trim(),
      course: courseId,
    });

    res.status(201).json(module);
  };

  const deleteModule = (
    req: Request<{ moduleId: string }>,
    res: Response
  ) => {
    dao.deleteModule(req.params.moduleId);
    res.sendStatus(200);
  };

  const updateModule = (
    req: Request<{ moduleId: string }>,
    res: Response
  ) => {
    const name = req.body?.name;
    const description = req.body?.description;

    if (
      (name !== undefined &&
        (typeof name !== "string" || name.trim() === "")) ||
      (description !== undefined && typeof description !== "string")
    ) {
      res.status(400).json({ message: "Invalid module details." });
      return;
    }

    const module = dao.updateModule(req.params.moduleId, {
      name: name === undefined ? undefined : name.trim(),
      description,
    });

    if (!module) {
      res.status(404).json({ message: "Module not found." });
      return;
    }

    res.json(module);
  };

  app.get("/api/courses/:courseId/modules", findModulesForCourse);
  app.post("/api/courses/:courseId/modules", createModuleForCourse);
  app.delete("/api/modules/:moduleId", deleteModule);
  app.put("/api/modules/:moduleId", updateModule);
}
