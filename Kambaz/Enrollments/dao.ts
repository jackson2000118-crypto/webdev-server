import { v4 as uuidv4 } from "uuid";
import type database from "../Database";

export default function EnrollmentsDao(db: typeof database) {
  function enrollUserInCourse(
    userId: string,
    courseId: string
  ) {
    const existingEnrollment = db.enrollments.find(
      (enrollment) =>
        enrollment.user === userId &&
        enrollment.course === courseId
    );

    if (existingEnrollment) {
      return existingEnrollment;
    }

    const newEnrollment = {
      _id: uuidv4(),
      user: userId,
      course: courseId,
    };

    db.enrollments.push(newEnrollment);

    return newEnrollment;
  }

  function unenrollUserFromCourse(
    userId: string,
    courseId: string
  ) {
    db.enrollments = db.enrollments.filter(
      (enrollment) =>
        !(
          enrollment.user === userId &&
          enrollment.course === courseId
        )
    );
  }

  return {
    enrollUserInCourse,
    unenrollUserFromCourse,
  };
}
