import { v4 as uuidv4 } from "uuid";
import type database from "../Database";

type User = (typeof database.users)[number];

export default function UsersDao(db: typeof database) {
  const findUserByCredentials = (
    username: string,
    password: string
  ) => {
    return db.users.find(
      (user) =>
        user.username === username &&
        user.password === password
    );
  };

  const findUserByUsername = (username: string) => {
    return db.users.find(
      (user) => user.username === username
    );
  };

  const createUser = (user: Omit<User, "_id">) => {
    const newUser = {
      ...user,
      _id: uuidv4(),
    };

    db.users = [...db.users, newUser];

    return newUser;
  };
  const findUserById = (userId: string) => {
  return db.users.find(
    (user) => user._id === userId
  );
};

  const updateUser = (
    userId: string,
    updates: Partial<User>
  ) => {
    db.users = db.users.map((user) => {
      if (user._id === userId) {
        return {
          ...user,
          ...updates,
          _id: userId,
        };
      }

      return user;
    });
  };
  return {
    findUserByCredentials,
    findUserByUsername,
    createUser,
    findUserById,
    updateUser,
  };
}