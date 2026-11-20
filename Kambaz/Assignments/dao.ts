import { v4 as uuidv4 } from "uuid";
import type database from "../Database";

export type Assignment = (typeof database.assignments)[number] & {
  availableUntil?: string;
  group?: string;
  displayGradeAs?: string;
  submissionType?: string;
  onlineEntryOptions?: string[];
  assignTo?: string;
  notes?: string;
};

export type AssignmentDetails = Omit<Assignment, "_id" | "course">;

export default function AssignmentsDao(db: typeof database) {
  function findAssignmentsForCourse(courseId: string): Assignment[] {
    return db.assignments.filter(
      (assignment) => assignment.course === courseId
    );
  }

  function findAssignmentById(assignmentId: string): Assignment | undefined {
    return db.assignments.find((assignment) => assignment._id === assignmentId);
  }

  function createAssignment(
    courseId: string,
    details: AssignmentDetails
  ): Assignment {
    const created = {
      ...details,
      _id: uuidv4(),
      course: courseId
    };

    db.assignments = [...db.assignments, created];
    return created;
  }

  function updateAssignment(
    assignmentId: string,
    details: AssignmentDetails
  ): Assignment | null {
    const assignment = findAssignmentById(assignmentId);

    if (!assignment) {
      return null;
    }

    Object.assign(assignment, details);
    return assignment;
  }

  function deleteAssignment(assignmentId: string) {
    db.assignments = db.assignments.filter(
      (assignment) => assignment._id !== assignmentId
    );
  }

  return {
    findAssignmentsForCourse,
    findAssignmentById,
    createAssignment,
    updateAssignment,
    deleteAssignment
  };
}
