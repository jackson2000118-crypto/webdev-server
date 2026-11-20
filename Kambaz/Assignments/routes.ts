import type { Express, Request, Response } from "express";
import type database from "../Database";
import AssignmentsDao, { type AssignmentDetails } from "./dao";

function readDetails(body: unknown): AssignmentDetails | null {
  if (!body || typeof body !== "object") {
    return null;
  }

  const data = body as Record<string, unknown>;

  if (
    typeof data.title !== "string" ||
    data.title.trim() === "" ||
    typeof data.points !== "number" ||
    !Number.isFinite(data.points) ||
    data.points < 0
  ) {
    return null;
  }

  const textFields = [
    "description",
    "due",
    "available",
    "availableUntil",
    "group",
    "displayGradeAs",
    "submissionType",
    "assignTo",
    "notes"
  ];

  if (
    textFields.some(
      (field) => data[field] !== undefined && typeof data[field] !== "string"
    )
  ) {
    return null;
  }

  if (
    data.onlineEntryOptions !== undefined &&
    (!Array.isArray(data.onlineEntryOptions) ||
      !data.onlineEntryOptions.every((option) => typeof option === "string"))
  ) {
    return null;
  }

  // Only accept editable fields. The URL determines course and assignment ID.
  return {
    title: data.title.trim(),
    points: data.points,
    description: (data.description as string | undefined) ?? "",
    due: (data.due as string | undefined) ?? "",
    available: (data.available as string | undefined) ?? "",
    availableUntil: (data.availableUntil as string | undefined) ?? "",
    group: (data.group as string | undefined) ?? "ASSIGNMENTS",
    displayGradeAs: (data.displayGradeAs as string | undefined) ?? "Percentage",
    submissionType: (data.submissionType as string | undefined) ?? "Online",
    onlineEntryOptions: (data.onlineEntryOptions as string[] | undefined) ?? [],
    assignTo: (data.assignTo as string | undefined) ?? "Everyone",
    notes: (data.notes as string | undefined) ?? ""
  };
}

export default function AssignmentRoutes(app: Express, db: typeof database) {
  const dao = AssignmentsDao(db);

  const findAssignmentsForCourse = (
    req: Request<{ courseId: string }>,
    res: Response
  ) => {
    res.json(dao.findAssignmentsForCourse(req.params.courseId));
  };

  const findAssignmentById = (
    req: Request<{ assignmentId: string }>,
    res: Response
  ) => {
    const assignment = dao.findAssignmentById(req.params.assignmentId);

    if (!assignment) {
      res.status(404).json({ message: "Assignment not found." });
      return;
    }

    res.json(assignment);
  };

  const createAssignmentForCourse = (
    req: Request<{ courseId: string }>,
    res: Response
  ) => {
    const { courseId } = req.params;

    if (!db.courses.some((course) => course._id === courseId)) {
      res.status(404).json({ message: "Course not found." });
      return;
    }

    const details = readDetails(req.body);

    if (!details) {
      res.status(400).json({ message: "Invalid assignment details." });
      return;
    }

    res.status(201).json(dao.createAssignment(courseId, details));
  };

  const updateAssignment = (
    req: Request<{ assignmentId: string }>,
    res: Response
  ) => {
    const details = readDetails(req.body);

    if (!details) {
      res.status(400).json({ message: "Invalid assignment details." });
      return;
    }

    const saved = dao.updateAssignment(req.params.assignmentId, details);

    if (!saved) {
      res.status(404).json({ message: "Assignment not found." });
      return;
    }

    res.json(saved);
  };

  const deleteAssignment = (
    req: Request<{ assignmentId: string }>,
    res: Response
  ) => {
    dao.deleteAssignment(req.params.assignmentId);
    res.sendStatus(200);
  };

  app.get("/api/courses/:courseId/assignments", findAssignmentsForCourse);
  app.post("/api/courses/:courseId/assignments", createAssignmentForCourse);
  app.get("/api/assignments/:assignmentId", findAssignmentById);
  app.put("/api/assignments/:assignmentId", updateAssignment);
  app.delete("/api/assignments/:assignmentId", deleteAssignment);
}
