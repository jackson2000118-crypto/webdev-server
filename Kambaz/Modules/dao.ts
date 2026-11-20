import { v4 as uuidv4 } from "uuid";
import type database from "../Database";

type CourseModule = (typeof database.modules)[number];

export default function ModulesDao(db: typeof database) {
  function findModulesForCourse(courseId: string) {
    return db.modules.filter(
      (module) => module.course === courseId
    );
  }

  function createModule(
    module: Pick<CourseModule, "name" | "course">
  ) {
    const newModule: CourseModule = {
      _id: uuidv4(),
      name: module.name,
      description: "",
      course: module.course,
      lessons: [],
    };

    db.modules = [...db.modules, newModule];
    return newModule;
  }

  function deleteModule(moduleId: string) {
    db.modules = db.modules.filter(
      (module) => module._id !== moduleId
    );
  }

  function updateModule(
    moduleId: string,
    updates: Partial<Pick<CourseModule, "name" | "description">>
  ) {
    const module = db.modules.find(
      (module) => module._id === moduleId
    );

    if (!module) {
      return null;
    }

    if (updates.name !== undefined) {
      module.name = updates.name;
    }

    if (updates.description !== undefined) {
      module.description = updates.description;
    }

    return module;
  }

  return {
    findModulesForCourse,
    createModule,
    deleteModule,
    updateModule,
  };
}
