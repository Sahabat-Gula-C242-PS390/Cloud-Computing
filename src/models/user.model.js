import db from "../utils/firestore.js";
import { randomUUIDv7 } from "bun";
import { Timestamp } from "@google-cloud/firestore";

const usersCollection = db.collection("users");

/**
 * Create a user.
 *
 * @param {Object} data - The user data.
 * @param {string} data.name - The user's name.
 * @param {string} data.email - The user's email.
 * @param {string} data.password - The user's password.
 */
class User {
  constructor(data) {
    if (data === undefined || typeof data !== "object") {
      throw new TypeError("data must be a valid object!");
    }

    const required = {
      name: data.name,
      email: data.email,
      password: data.password,
    };

    for (const [field, value] of Object.entries(required)) {
      if (!value) {
        throw new TypeError(`${field} is required!`);
      }
      if (typeof value !== "string") {
        throw new TypeError(`${field} must be a valid string!`);
      }
    }

    this.userId = randomUUIDv7();
    this.name = data.name;
    this.email = data.email;
    this.password = data.password;
    this.status = "inactive";
    this.createdAt = Timestamp.now();
    this.updatedAt = this.createdAt;
  }

  /**
   * Save and upload the user data into Firestore database on users collection.
   * This will be used only for registration purposes. To add details to the
   * user data, you should use `update()`.
   *
   * If the email used already exists, it will throw an error. Otherwise, it
   * will return the userId of the user.
   *
   * @returns {string} The userId of the user.
   * @throws {Error} If the email already exists.
   */
  static async save() {
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
        // gender: this.gender,
        // dailySugarLimit: this.dailySugarLimit,
        // currentSugarIntake: this.currentSugarIntake,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
      });
      // console.log("Document added successfully!");

      return this.userId;
    } catch (error) {
      // console.error("Error adding document: ", error);
      throw new Error(`Error adding document: ${error}`);
    }
  }

  /**
   * Find a user by userId. The method will return null if the user is not
   * found.
   *
   * @param {string} userId - The userId of the user.
   * @returns {Object | null} The user data or null if not found.
   * @throws {TypeError} If the userId is not a valid string.
   * @throws {Error} If an error occurs while finding the user.
   */
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
      throw new Error(`Error finding user ${userId}: ${error}`);
    }
  }

  /**
   * Find a user by specific field and value. The field specifies the document
   * field to query. The field value will be compared with the value given and
   * returns the first one it founds. The method will return null if the user is
   * not found.
   *
   * @param {Object} query - The query object.
   * @param {string} query.field - The field to query.
   * @param {string} query.value - The value to compare with the field.
   * @returns {Object | null} The user data or null if not found.
   * @throws {TypeError} If the query is not a valid object.
   * @throws {TypeError} If the field is not a valid string.
   * @throws {TypeError} If the value is not a valid string.
   * @throws {Error} If an error occurs while finding the user.
   */
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
      throw new Error(`Error finding documents with query ${query}: ${error}`);
    }
  }

  /**
   * Find all users by specific field and value. The field specifies the
   * document field to query. The field value will be compared with the value
   * given and returns all the users it founds. You can also specify the order
   * (default to `__name__`) and the direction of the order (default to `asc`).
   *
   * The results are all the users that matches the query and maps the documents
   * into an array of objects. If no documents are found, it will return an
   * empty array.
   *
   * @param {Object} query - The query object.
   * @param {string} query.field - The field to query.
   * @param {string} query.value - The value to compare with the field.
   * @param {string} [query.orderBy] - The field to order the results.
   * @param {"asc" | "desc"} [query.orderDirection] - The direction of the
   *   order.
   * @returns {Array} The array of user data or an empty array if not found.
   * @throws {TypeError} If the query is not a valid object.
   * @throws {TypeError} If the field is not a valid string.
   * @throws {TypeError} If the value is not a valid string.
   * @throws {Error} If an error occurs while finding the user.
   */
  static async find(
    query = {
      field: "",
      value: "",
      orderBy: "__name__",
      orderDirection: "asc",
    },
  ) {
    try {
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
      throw new Error(`Error finding documents with query ${query}: ${error}`);
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
      throw new Error(`Error finding all documents: ${error}`);
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
      throw new Error(`Error updating user ${userId}: ${error}`);
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
      throw new Error(`Error deleting user ${userId}: ${error}`);
    }
  }

  // Development helper method
  getAllData() {
    return {
      userId: this.userId,
      name: this.name,
      email: this.email,
      password: this.password,
      // gender: this.gender,
      // dailySugarLimit: this.dailySugarLimit,
      // currentSugarIntake: this.currentSugarIntake,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
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
