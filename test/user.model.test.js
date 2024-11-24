import { expect, describe, it, afterAll } from "bun:test";
import User from "../src/models/user.model.js";

const userData = {
  name: "John Doe",
  email: "johndoe1@example.com",
  password: "password123",
  gender: "male",
};
const newUser = new User(userData);

describe("User Model", () => {
  describe("Create user", () => {
    it("should create a new user", () => {
      expect(newUser).toEqual(
        expect.objectContaining({
          name: userData.name,
          email: userData.email,
          password: userData.password,
          gender: userData.gender,
        })
      );
    });

    it("should throw an error when creating new user if required fields does not meet requirements", async () => {
      expect(() => new User()).toThrow(
        new TypeError("data must be a valid object!")
      );
      expect(() => new User({})).toThrow(new TypeError("name is required!"));
      expect(() => new User({ name: "John Doe" })).toThrow(
        new TypeError("email is required!")
      );
      expect(() => new User({ name: 1 })).toThrow(
        new TypeError("name must be a valid string!")
      );
      expect(
        () => new User({ name: "John Doe", email: "johndoe1@example.com" })
      ).toThrow(new TypeError("password is required!"));
      expect(() => new User({ name: "John Doe", email: 1 })).toThrow(
        new TypeError("email must be a valid string!")
      );
      expect(
        () =>
          new User({
            name: "John Doe",
            email: "johndoe1@example.com",
            password: "password123",
          })
      ).toThrow(new TypeError("gender is required!"));
      expect(
        () =>
          new User({
            name: "John Doe",
            email: "johndoe1@example.com",
            password: 1,
          })
      ).toThrow(new TypeError("password must be a valid string!"));
      expect(
        () =>
          new User({
            name: "John Doe",
            email: "johndoe1@example.com",
            password: "password123",
            gender: 1,
          })
      ).toThrow(new TypeError("gender must be a valid string!"));
      expect(
        () =>
          new User({
            name: "John Doe",
            email: "johndoe1@example.com",
            password: "password123",
            gender: "Male",
          })
      ).toThrow(new TypeError("gender must be lowercase 'male' or 'female'!"));
    });
  });

  describe("Save user", () => {
    it("should save a new user", async () => {
      const receivedUser = await newUser.save();

      expect(receivedUser).toBeDefined();
      expect(receivedUser).toBe(newUser.userId);
    });

    it("should throw an error when saving if email already exists", async () => {
      const receivedUser = new User(userData);
      expect(() => receivedUser.save()).toThrow(
        new Error("Email already exists!")
      );
    });
  });

  describe("Find user(s)", () => {
    it("should find a user by ID", async () => {
      const receivedUser = await User.findById(newUser.userId);

      expect(receivedUser).toEqual({
        userId: newUser.userId,
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        gender: newUser.gender,
        dailySugarLimit: newUser.dailySugarLimit,
        currentSugarIntake: newUser.currentSugarIntake,
        createdAt: newUser.createdAt.toDate(),
        updatedAt: newUser.updatedAt.toDate(),
      });
    });

    it("should return null when user is not found by ID", async () => {
      const receivedUser = await User.findById("invalidUserId");

      expect(receivedUser).toBeNull();
    });

    it("should throw an error when finding user by ID if ID is invalid", async () => {
      expect(() => User.findById()).toThrow(
        new TypeError("userId must be a valid string!")
      );
      expect(() => User.findById(1)).toThrow(
        new TypeError("userId must be a valid string!")
      );
    });

    it("should find a user by email string", async () => {
      const receivedUser = await User.findOne({
        field: "email",
        value: "johndoe1@example.com",
      });

      expect(receivedUser).toEqual({
        userId: newUser.userId,
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        gender: newUser.gender,
        dailySugarLimit: newUser.dailySugarLimit,
        currentSugarIntake: newUser.currentSugarIntake,
        createdAt: newUser.createdAt.toDate(),
        updatedAt: newUser.updatedAt.toDate(),
      });
    });

    it("should find a user by date", async () => {
      const receivedUser = await User.findOne({
        field: "createdAt",
        value: newUser.createdAt,
      });

      expect(receivedUser).toEqual({
        userId: newUser.userId,
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        gender: newUser.gender,
        dailySugarLimit: newUser.dailySugarLimit,
        currentSugarIntake: newUser.currentSugarIntake,
        createdAt: newUser.createdAt.toDate(),
        updatedAt: newUser.updatedAt.toDate(),
      });
    });

    it("should return null when user is not found by field", async () => {
      const receivedValue = await User.findOne({
        field: "email",
        value: "nothing@nothing.com",
      });

      expect(receivedValue).toBeNull();
    });

    it("should throw an error when finding user by field if query is invalid", async () => {
      expect(() => User.findOne()).toThrow(
        new TypeError("query must be a valid object!")
      );
      expect(() => User.findOne({})).toThrow(
        new TypeError("field is required!")
      );
      expect(() => User.findOne({ field: 1 })).toThrow(
        new TypeError("field must be a valid string!")
      );
      expect(() => User.findOne({ field: "email" })).toThrow(
        new TypeError("value is required!")
      );
    });

    it("should return a single user when finding one by field get multiple docs", async () => {
      const newUser2 = new User({
        name: "Jane Doe",
        email: "janedoe@example.com",
        password: "password123",
        gender: "male",
      });
      await newUser2.save();

      const receivedUser = await User.findOne({
        field: "gender",
        value: "male",
      });

      expect(receivedUser).toEqual({
        ...receivedUser,
        gender: "male",
      });
    });

    it("should return two users when finding users by field gender", async () => {
      const newUser3 = new User({
        name: "Obama",
        email: "obama@example.com",
        password: "password123",
        gender: "female",
      });
      await newUser3.save();

      const receivedUser = await User.find({ field: "gender", value: "male" });
      // console.log(receivedUser);
      expect(receivedUser).toHaveLength(2);
      expect(receivedUser);
      receivedUser.forEach((user) => {
        expect(user).toEqual(expect.objectContaining({ gender: "male" }));
      });
    });

    it("should return a single user when finding users by field id", async () => {
      const receivedUser = await User.find({
        field: "userId",
        value: newUser.userId,
      });
      expect(receivedUser).toHaveLength(1);
      expect(receivedUser[0]).toEqual({
        userId: newUser.userId,
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        gender: newUser.gender,
        dailySugarLimit: newUser.dailySugarLimit,
        currentSugarIntake: newUser.currentSugarIntake,
        createdAt: newUser.createdAt.toDate(),
        updatedAt: newUser.updatedAt.toDate(),
      });
    });

    it("should return no user when finding users by field id", async () => {
      const receivedUser = await User.find({
        field: "userId",
        value: "invalidUserId",
      });
      expect(receivedUser).toHaveLength(0);
    });

    it("should return two users sorted by newest date when finding users by field date asecnding", async () => {
      const receivedUser = await User.find({
        field: "gender",
        value: "male",
        orderBy: "createdAt",
        orderDirection: "desc",
      });
      expect(receivedUser).toHaveLength(2);
      expect(receivedUser[0].createdAt > receivedUser[1].createdAt).toBe(true);
    });

    it("should return three users when finding all users", async () => {
      const receivedUsers = await User.findAll();
      expect(receivedUsers).toHaveLength(3);
    });
  });

  describe("Update user", () => {
    it("should update a user", async () => {
      const updatedData = {
        name: "John Doe Jr.",
        email: "johndoejr@example.com",
        gender: "female",
      };

      const receivedUser = await User.update(newUser.userId, updatedData);

      expect(receivedUser).toBeTruthy();
      expect(receivedUser.name).toBe(updatedData.name);
      expect(receivedUser.email).toBe(updatedData.email);
      expect(receivedUser.gender).toBe(updatedData.gender);
      expect(receivedUser.updatedAt).not.toBe(newUser.updatedAt);
      expect(receivedUser.updatedAt).not.toBe(receivedUser.createdAt);
    });

    it("should throw an error when updating user if ID is invalid", async () => {
      const updatedData = {
        name: "Mr. Smartass",
        email: "smartass@example.com",
        gender: "male",
      };

      const nameIncorrectData = {
        name: 1,
        email: "smartass@example.com",
        gender: "male",
      };

      const emailIncorrectData = {
        name: "Mr. Smartass",
        email: 1,
        gender: "male",
      };

      const genderIncorrectData = {
        name: "Mr. Smartass",
        email: "smartass@example.com",
        gender: 1,
      };

      const genderCaseIncorrectData = {
        name: "Mr. Smartass",
        email: "smartass@example.com",
        gender: "Female",
      };

      expect(() => User.update()).toThrow(
        new TypeError("userId must be a valid string!")
      );
      expect(() => User.update(1)).toThrow(
        new TypeError("userId must be a valid string!")
      );
      expect(() => User.update("invalidUserId", 1)).toThrow(
        new TypeError("newData must be a valid object!")
      );
      expect(() => User.update("invalidUserId", {})).toThrow(
        new TypeError("No valid fields to update!")
      );
      expect(() => User.update("invalidUserId", nameIncorrectData)).toThrow(
        new TypeError("name must be a valid string!")
      );
      expect(() => User.update("invalidUserId", emailIncorrectData)).toThrow(
        new TypeError("email must be a valid string!")
      );
      expect(() => User.update("invalidUserId", genderIncorrectData)).toThrow(
        new TypeError("gender must be a valid string!")
      );
      expect(() =>
        User.update("invalidUserId", genderCaseIncorrectData)
      ).toThrow(new TypeError("gender must be lowercase 'male' or 'female'!"));
      expect(() => User.update("invalidUserId", updatedData)).toThrow(
        new TypeError("userId not found!")
      );
    });

    it("should throw an error when updating user if email already exists", async () => {
      const updatedData = {
        name: "Mr. Smartass",
        email: "obama@example.com",
        gender: "male",
      };

      expect(() => User.update(newUser.userId, updatedData)).toThrow(
        new Error("Email already exists!")
      );
    });
  });

  describe("Delete user", async () => {
    it("should delete a user", async () => {
      const received = await User.delete(newUser.userId);

      expect(received).toBe(true);
      expect(await User.findById(newUser.userId)).toBeNull();
    });

    it("should throw an error when deleting user if ID is invalid", async () => {
      expect(() => User.delete()).toThrow(
        new TypeError("userId must be a valid string!")
      );
      expect(() => User.delete(1)).toThrow(
        new TypeError("userId must be a valid string!")
      );
      expect(() => User.delete("invalidUserId")).toThrow(
        new Error("userId not found!")
      );
    });
  });
});

afterAll(async () => {
  await User.deleteAll();

  const allUsers = await User.findAll();
  expect(allUsers).toHaveLength(0);
});
