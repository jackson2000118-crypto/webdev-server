import { v4 as uuidv4 } from "uuid";
import type database from "../Database";

type Course = (typeof database.courses)[number];

export default function CoursesDao(db: typeof database) {
  function findAllCourses() {
    return db.courses;
  }

  function findCoursesForEnrolledUser(userId: string) {
    return db.courses.filter((course) =>
      db.enrollments.some(
        (enrollment) =>
          enrollment.user === userId &&
          enrollment.course === course._id
      )
    );
  }

  function createCourse(course: Omit<Course, "_id">) {
    const newCourse = {
      ...course,
      _id: uuidv4(),
    };

    db.courses = [...db.courses, newCourse];
    return newCourse;
  }

  function deleteCourse(courseId: string) {
    db.courses = db.courses.filter(
      (course) => course._id !== courseId
    );
    db.enrollments = db.enrollments.filter(
      (enrollment) => enrollment.course !== courseId
    );
  }

  function updateCourse(courseId: string, updates: Partial<Course>) {
    const course = db.courses.find(
      (course) => course._id === courseId
    );

    if (!course) {
      return null;
    }

    Object.assign(course, updates, { _id: courseId });
    return course;
  }

  return {
    findAllCourses,
    findCoursesForEnrolledUser,
    createCourse,
    deleteCourse,
    updateCourse,
  };
}
