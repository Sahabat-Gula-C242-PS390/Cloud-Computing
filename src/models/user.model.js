import db from "../utils/firestore.js";
import { randomUUIDv7 } from "bun";
import { Timestamp } from "@google-cloud/firestore";
import {
  customCheckField,
  findCheckField,
  userCheckField,
} from "../utils/checkField.js";

const usersCollection = db.collection("users");

class User {
  /**
   * Create a user.
   *
   * @param {Object} data - The user data.
   * @param {string} data.name - The user's name.
   * @param {string} data.email - The user's email.
   * @param {string} data.password - The user's password.
   * @param {"male" | "female"} data.gender - The user's gender.
   * @param {number} data.umur - The user's age.
   * @param {number} data.berat - The user's weight.
   * @param {number} data.tinggi - The user's height.
   * @param {"small" | "medium" | "large"} data.lingkarPinggang - The user's
   *   waist circumference.
   * @param {boolean} data.tekananDarahTinggi - The user's high blood pressure
   *   status.
   * @param {boolean} data.gulaDarahTinggi - The user's high blood sugar status.
   * @param {boolean} data.riwayatDiabetes - The user's diabetes history.
   * @param {"none" | "low" | "medium" | "high" | "extreme"} data.tingkatAktivitas
   *   - The user's activity level.
   *
   * @param {boolean} data.konsumsiBuah - The user's fruit consumption status.
   * @param {number} data.kaloriHarian - The user's daily calorie intake.
   * @param {number} data.karbohidratHarian - The user's daily carbohydrate
   *   intake.
   * @param {number} data.lemakHarian - The user's daily fat intake.
   * @param {number} data.proteinHarian - The user's daily protein intake.
   * @param {number} data.gulaHarian - The user's daily sugar intake.
   */
  constructor(data) {
    if (data === undefined || typeof data !== "object") {
      throw new TypeError("data must be a valid object!");
    }

    const required = {
      email: data.email,
      name: data.name,
      password: data.password,
      gender: data.gender,
      umur: data.umur,
      berat: data.berat,
      tinggi: data.tinggi,
      lingkarPinggang: data.lingkarPinggang,
      tekananDarahTinggi: data.tekananDarahTinggi,
      gulaDarahTinggi: data.gulaDarahTinggi,
      riwayatDiabetes: data.riwayatDiabetes,
      tingkatAktivitas: data.tingkatAktivitas,
      konsumsiBuah: data.konsumsiBuah,
      kaloriHarian: data.kaloriHarian,
      karbohidratHarian: data.karbohidratHarian,
      lemakHarian: data.lemakHarian,
      proteinHarian: data.proteinHarian,
      gulaHarian: data.gulaHarian,
    };

    userCheckField(required);

    this.userId = randomUUIDv7();
    this.email = data.email;
    this.name = data.name;
    this.password = data.password;
    this.createdAt = Timestamp.now();
    this.updatedAt = this.createdAt;
    this.gender = data.gender;
    this.umur = data.umur;
    this.berat = data.berat;
    this.tinggi = data.tinggi;
    this.lingkarPinggang = data.lingkarPinggang;
    this.tekananDarahTinggi = data.tekananDarahTinggi;
    this.gulaDarahTinggi = data.gulaDarahTinggi;
    this.riwayatDiabetes = data.riwayatDiabetes;
    this.tingkatAktivitas = data.tingkatAktivitas;
    this.konsumsiBuah = data.konsumsiBuah;
    this.kaloriHarian = data.kaloriHarian;
    this.karbohidratHarian = data.karbohidratHarian;
    this.lemakHarian = data.lemakHarian;
    this.proteinHarian = data.proteinHarian;
    this.gulaHarian = data.gulaHarian;
    this.isPremium = false;
  }

  /**
   * Save and upload the user data into Firestore database on users collection.
   * This will be used only for registration purposes. To add details to the
   * user data, you should use `update()`.
   *
   * If the email used already exists, it will throw an error. Otherwise, it
   * will return the userId of the user.
   *
   * @returns {Promise<string>} The userId of the user.
   * @throws {Error} If the email already exists.
   */
  async save() {
    /* const queryValidation = await User.findOne({
      field: "email",
      value: this.email,
    });

    if (queryValidation) {
      throw new Error("Email already exists!");
    } */

    // console.log("Adding document with userId: " + this.userId);

    try {
      await usersCollection.doc(this.userId).set({
        userId: this.userId,
        email: this.email,
        name: this.name,
        password: this.password,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        gender: this.gender,
        umur: this.umur,
        berat: this.berat,
        tinggi: this.tinggi,
        lingkarPinggang: this.lingkarPinggang,
        tekananDarahTinggi: this.tekananDarahTinggi,
        gulaDarahTinggi: this.gulaDarahTinggi,
        riwayatDiabetes: this.riwayatDiabetes,
        tingkatAktivitas: this.tingkatAktivitas,
        konsumsiBuah: this.konsumsiBuah,
        kaloriHarian: this.kaloriHarian,
        karbohidratHarian: this.karbohidratHarian,
        lemakHarian: this.lemakHarian,
        proteinHarian: this.proteinHarian,
        gulaHarian: this.gulaHarian,
        isPremium: this.isPremium,
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
   * @returns {Promise<Object | null>} The user data or null if not found.
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
   * @returns {Promise<Object | null>} The user data or null if not found.
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

    findCheckField(required);

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
    if (!query || typeof query !== "object") {
      throw new TypeError("query must be a valid object!");
    }

    const required = {
      field: query.field,
      value: query.value,
    };

    findCheckField(required);

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

  /**
   * Get all users in the collection. The results are all the users in the
   * collection mapped into an array of objects. If no documents are found, it
   * will return an empty array.
   *
   * @returns {Object[]} The array of user data or an empty array if not found.
   * @throws {Error} If an error occurs while finding the user.
   */
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

  /**
   * Updates a user's information in the database.
   *
   * @param {string} userId - The ID of the user to update.
   * @param {Object} newData - An object containing the new data for the user.
   * @param {string} [newData.name] - The new name of the user.
   * @param {string} [newData.email] - The new email of the user.
   * @param {string} [newData.password] - The new password of the user.
   * @param {string} [newData.gender] - The new gender of the user ('male' or
   *   'female').
   * @param {number} [newData.umur] - The new age of the user.
   * @param {number} [newData.berat] - The new weight of the user.
   * @param {number} [newData.tinggi] - The new height of the user.
   * @param {string} [newData.lingkarPinggang] - The new waist circumference of
   *   the user ('small', 'medium', or 'large').
   * @param {boolean} [newData.tekananDarahTinggi] - The new high blood pressure
   *   status of the user.
   * @param {boolean} [newData.gulaDarahTinggi] - The new high blood sugar
   *   status of the user.
   * @param {boolean} [newData.riwayatDiabetes] - The new diabetes history
   *   status of the user.
   * @param {string} [newData.tingkatAktivitas] - The new activity level of the
   *   user ('none', 'low', 'medium', 'high', or 'extreme').
   * @param {boolean} [newData.konsumsiBuah] - The new fruit consumption status
   *   of the user.
   * @param {number} [newData.kaloriHarian] - The new daily calorie intake of
   *   the user.
   * @param {number} [newData.karbohidratHarian] - The new daily carbohydrate
   *   intake of the user.
   * @param {number} [newData.lemakHarian] - The new daily fat intake of the
   *   user.
   * @param {number} [newData.proteinHarian] - The new daily protein intake of
   *   the user.
   * @param {number} [newData.gulaHarian] - The new daily sugar intake of the
   *   user.
   * @param {boolean} [newData.isPremium] - The new premium status of the user.
   * @returns {Promise<Object>} The updated user object.
   * @throws {TypeError} If userId is not a valid string.
   * @throws {TypeError} If newData is not a valid object.
   * @throws {TypeError} If any field in newData is not of the expected type.
   * @throws {Error} If no valid fields are provided to update.
   * @throws {Error} If the email already exists.
   * @throws {Error} If the userId is not found.
   * @throws {Error} If there is an error updating the user.
   */
  static async update(userId, newData) {
    if (!userId || typeof userId !== "string") {
      throw new TypeError("userId must be a valid string!");
    }

    if (!newData || typeof newData !== "object") {
      throw new TypeError("newData must be a valid object!");
    }

    const allowedFields = [
      "name",
      "email",
      "password",
      "gender",
      "umur",
      "berat",
      "tinggi",
      "lingkarPinggang",
      "tekananDarahTinggi",
      "gulaDarahTinggi",
      "riwayatDiabetes",
      "tingkatAktivitas",
      "konsumsiBuah",
      "kaloriHarian",
      "karbohidratHarian",
      "lemakHarian",
      "proteinHarian",
      "gulaHarian",
      "isPremium",
    ];

    const updates = {};

    for (const [field, value] of Object.entries(newData)) {
      if (!allowedFields.includes(field)) continue;

      if (
        ["name", "email", "password"].includes(field) &&
        typeof value !== "string"
      ) {
        throw new TypeError(`${field} must be a valid string!`);
      }

      if (
        [
          "umur",
          "berat",
          "tinggi",
          "kaloriHarian",
          "karbohidratHarian",
          "lemakHarian",
          "proteinHarian",
          "gulaHarian",
        ].includes(field) &&
        typeof value !== "number"
      ) {
        throw new TypeError(`${field} must be a valid number!`);
      }

      if (
        [
          "tekananDarahTinggi",
          "gulaDarahTinggi",
          "riwayatDiabetes",
          "konsumsiBuah",
          "isPremium",
        ].includes(field) &&
        typeof value !== "boolean"
      ) {
        throw new TypeError(`${field} must be a boolean!`);
      }

      if (field === "gender" && !["male", "female"].includes(value)) {
        throw new TypeError("gender must be 'male' or 'female'!");
      }

      if (
        field === "lingkarPinggang" &&
        !["small", "medium", "large"].includes(value)
      ) {
        throw new TypeError(
          "lingkarPinggang must be 'small', 'medium', or 'large'!",
        );
      }

      if (
        field === "tingkatAktivitas" &&
        !["none", "low", "medium", "high", "extreme"].includes(value)
      ) {
        throw new TypeError(
          "tingkatAktivitas must be 'none', 'low', 'medium', 'high', or 'extreme'!",
        );
      }
      updates[field] = value;
    }
    if (Object.keys(updates).length === 0) {
      throw new Error("No valid fields to update!");
    }

    /* const queryValidation = await User.findOne({
      field: "email",
      value: newData.email,
    });
    if (queryValidation) {
      throw new Error("Email already exists!");
    } */

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

  /**
   * Deletes a user by their userId.
   *
   * @param {string} userId - The ID of the user to delete.
   * @returns {Promise<boolean>} Returns true if the user was successfully
   *   deleted, otherwise false.
   * @throws {Error} If the userId is not found or if there is an error during
   *   deletion.
   */
  static async findByIdAndDelete(userId) {
    const required = {
      userId,
    };

    customCheckField(required);

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

  // Tambahkan di dalam class User
/**
 * Update the password for a specific user.
 *
 * @param {string} userId - The userId of the user.
 * @param {string} currentPassword - The current password for verification.
 * @param {string} newPassword - The new password to be updated.
 * @returns {Promise<Object>} The updated user data.
 * @throws {TypeError} If any of the arguments are not valid strings.
 * @throws {Error} If the userId is not found or the currentPassword is incorrect.
 */
static async updatePassword(userId, currentPassword, newPassword) {
  if (!userId || typeof userId !== "string") {
    throw new TypeError("userId must be a valid string!");
  }
  if (!currentPassword || typeof currentPassword !== "string") {
    throw new TypeError("currentPassword must be a valid string!");
  }
  if (!newPassword || typeof newPassword !== "string") {
    throw new TypeError("newPassword must be a valid string!");
  }
  if (currentPassword === newPassword) {
    throw new Error("The new password cannot be the same as the current password!");
  }

  // Find the user by userId
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found!");
  }

  // Verify the current password
  if (user.password !== currentPassword) {
    throw new Error("Current password is incorrect!");
  }

  // Update the password
  try {
    const updatedAt = Timestamp.now();
    await usersCollection.doc(userId).update({
      password: newPassword,
      updatedAt: updatedAt,
    });

    // Return the updated user data
    return await User.findById(userId);
  } catch (error) {
    throw new Error(`Error updating password for user ${userId}: ${error}`);
  }
}

}

export default User;
