import db from "../utils/firestore.js";
import { randomUUIDv7 } from "bun";
import { Timestamp } from "@google-cloud/firestore";

const usersCollection = db.collection("users");

class User {
  constructor(data) {
    if (data === undefined || typeof data !== "object") {
      throw new TypeError("data must be a valid object!");
    }

    const required = {
      name: data.name,
      email: data.email,
      password: data.password,
      gender: data.gender,
    };

    for (const [field, value] of Object.entries(required)) {
      if (!value) {
        throw new TypeError(`${field} is required!`);
      }
      if (typeof value !== "string") {
        throw new TypeError(`${field} must be a valid string!`);
      }
      if (field === "gender" && !["male", "female"].includes(value)) {
        throw new TypeError("gender must be lowercase 'male' or 'female'!");
      }
    }

    this.userId = randomUUIDv7();
    this.name = data.name;
    this.email = data.email;
    this.password = data.password;
    this.gender = data.gender;
    this.dailySugarLimit = 30;
    this.currentSugarIntake = 0;
    this.createdAt = Timestamp.now();
    this.updatedAt = this.createdAt;
  }

  async save() {
    const queryValidation = await User.findOne({
      field: "email",
      value: this.email,
    });

    if (queryValidation) {
      throw new Error("Email already exists!");
    }

    // console.log("Adding document with userId: " + this.userId);

    try {
      await usersCollection.doc(this.userId).set({
        userId: this.userId,
        name: this.name,
        email: this.email,
        password: this.password,
        gender: this.gender,
        dailySugarLimit: this.dailySugarLimit,
        currentSugarIntake: this.currentSugarIntake,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
      });
      // console.log("Document added successfully!");

      return this.userId;
    } catch (error) {
      // console.error("Error adding document: ", error);
      throw new Error("Error adding document: ", error);
    }
  }

  static async findById(userId) {
    if (!userId || typeof userId !== "string") {
      throw new TypeError("userId must be a valid string!");
    }

    try {
      const userDoc = await usersCollection.doc(userId).get();
      if (!userDoc.exists) {
        return null;
      }

      const userData = userDoc.data();
      return {
        ...userData,
        createdAt: userData.createdAt.toDate(),
        updatedAt: userData.updatedAt.toDate(),
      };
    } catch (error) {
      // console.error(`Error finding user ${userId}:`, error);
      throw new Error(`Error finding user ${userId}:`, error);
    }
  }

  static async findOne(query) {
    if (!query || typeof query !== "object") {
      throw new TypeError("query must be a valid object!");
    }

    const required = {
      field: query.field,
      value: query.value,
    };

    for (const [field, value] of Object.entries(required)) {
      if (!value) {
        throw new TypeError(`${field} is required!`);
      }
      if (field === "field" && typeof value !== "string") {
        throw new TypeError(`${field} must be a valid string!`);
      }
    }

    try {
      const userDoc = await usersCollection
        .where(query.field, "==", query.value)
        .get();
      if (userDoc.empty) {
        return null;
      }
      // console.log("Document found successfully!");
      const userData = userDoc.docs[0].data();
      return {
        ...userData,
        createdAt: userData.createdAt.toDate(),
        updatedAt: userData.updatedAt.toDate(),
      };
    } catch (error) {
      // console.error(`Error finding query ${query}:`, error);
      throw new Error(`Error finding documents with query ${query}:`, error);
    }
  }

  static async find(query) {
    try {
      // console.log("Finding documents with query: ", query);
      if (query.orderBy === undefined) {
        query.orderBy = "__name__";
      }
      if (query.orderDirection === undefined) {
        query.orderDirection = "asc";
      }
      const userDocs = await usersCollection
        .where(query.field, "==", query.value)
        .orderBy(query.orderBy, query.orderDirection)
        .get();
      if (userDocs.empty) {
        return [];
      }
      // console.log("Documents found successfully!");
      return userDocs.docs
        .map((doc) => doc.data())
        .map((data) => ({
          ...data,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        }));
    } catch (error) {
      // console.error("Error finding documents:", error);
      throw new Error(`Error finding documents with query ${query}:`, error);
    }
  }

  static async findAll() {
    try {
      // console.log("Finding all documents...");
      const userDocs = await usersCollection.get();
      if (userDocs.empty) {
        return [];
      }
      // console.log("Documents found successfully!");
      return userDocs.docs
        .map((doc) => doc.data())
        .map((data) => ({
          ...data,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        }));
    } catch (error) {
      throw new Error("Error finding all documents:", error);
    }
  }

  static async update(userId, newData) {
    if (!userId || typeof userId !== "string") {
      throw new TypeError("userId must be a valid string!");
    }
    if (!newData || typeof newData !== "object") {
      throw new TypeError("newData must be a valid object!");
    }

    const allowedFields = ["name", "email", "gender"];
    const updates = {};

    for (const [field, value] of Object.entries(newData)) {
      if (!allowedFields.includes(field)) continue;
      if (!value || typeof value !== "string") {
        throw new TypeError(`${field} must be a valid string!`);
      }
      if (field === "gender" && !["male", "female"].includes(value)) {
        throw new TypeError("gender must be lowercase 'male' or 'female'!");
      }
      updates[field] = value;
    }

    if (Object.keys(updates).length === 0) {
      throw new Error("No valid fields to update!");
    }

    const queryValidation = await User.findOne({
      field: "email",
      value: newData.email,
    });

    if (queryValidation) {
      throw new Error("Email already exists!");
    }

    const idValidation = await User.findById(userId);
    if (!idValidation) {
      throw new Error("userId not found!");
    }

    updates.updatedAt = Timestamp.now();

    try {
      await usersCollection.doc(userId).update(updates);
      return await User.findById(userId);
    } catch (error) {
      throw new Error(`Error updating user ${userId}:`, error);
    }
  }

  static async delete(userId) {
    if (!userId || typeof userId !== "string") {
      throw new TypeError("userId must be a valid string!");
    }

    const idValidation = await User.findById(userId);
    if (!idValidation) {
      throw new Error("userId not found!");
    }

    try {
      await usersCollection.doc(userId).delete();
      return (await User.findById(userId)) === null;
    } catch (error) {
      throw new Error(`Error deleting user ${userId}:`, error);
    }
  }

  // Development helper method
  getAllData() {
    return {
      userId: this.userId,
      name: this.name,
      email: this.email,
      password: this.password,
      gender: this.gender,
      dailySugarLimit: this.dailySugarLimit,
      currentSugarIntake: this.currentSugarIntake,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  getUserId() {
    return this.userId;
  }

  static async deleteAll() {
    try {
      // console.log("Deleting all documents in batches...");
      const batchSize = 100;
      let query = usersCollection.limit(batchSize);

      while (true) {
        const snapshot = await query.get();
        if (snapshot.empty) {
          break;
        }

        const batch = db.batch();
        snapshot.docs.forEach((doc) => {
          batch.delete(doc.ref);
        });

        await batch.commit();
        // console.log(`Deleted ${snapshot.size} documents`);
      }

      // console.log("All documents deleted successfully!");
    } catch (error) {
      console.error("Error deleting documents: ", error);
    }
  }
}

export default User;
