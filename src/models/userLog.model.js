import { userLogCheckField } from "../utils/checkField.js";
import db from "../utils/firestore.js";
import { Timestamp } from "@google-cloud/firestore";

const userLogsCollection = db.collection("userLogs");
const jakartaTimezoneOffset = 7 * 60 * 60 * 1000;

class UserLog {
  /**
   * Create a new UserLog instance
   *
   * @param {object} data - UserLog data
   * @param {string} data.userLogId - The userLogId
   * @param {string} data.userId - The userId
   * @param {string} data.foodId - The foodId
   * @param {boolean} data.isDeleted - The isDeleted status
   * @param {string} data.imageUrl - The image URL
   * @throws {TypeError} If data is not a valid object
   * @throws {TypeError} If userLogId, userId, foodId, isDeleted, or imageUrl is
   *   not a valid string or boolean
   */
  constructor(data) {
    if (data === undefined || typeof data !== "object") {
      throw new TypeError("data must be a valid object!");
    }

    const required = {
      userLogId: data.userLogId,
      userId: data.userId,
      foodId: data.foodId,
      imageUrl: data.imageUrl,
    };

    userLogCheckField(required);

    this.userLogId = data.userLogId;
    this.userId = data.userId;
    this.foodId = data.foodId;
    this.isDeleted = false;
    this.imageUrl = data.imageUrl;
    this.createdAt = Timestamp.now();
    this.updatedAt = this.createdAt;
  }

  /**
   * Upload user log data to Firestore
   *
   * @returns {Promise<string>} UserLogId
   * @throws {Error} If error adding documents
   */
  async save() {
    try {
      await userLogsCollection.doc(this.userLogId).set({
        userLogId: this.userLogId,
        userId: this.userId,
        foodId: this.foodId,
        isDeleted: this.isDeleted,
        imageUrl: this.imageUrl,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
      });

      return this.userLogId;
    } catch (error) {
      throw new Error("Error adding document: ", error);
    }
  }

  static async findById(userLogId) {
    if (!userLogId || typeof userLogId !== "string") {
      throw new TypeError("userLogId must be a valid string!");
    }

    try {
      const userLogDoc = await userLogsCollection.doc(userLogId).get();
      if (!userLogDoc.exists) {
        return null;
      }

      const data = userLogDoc.data();

      return {
        ...data,
        createdAt: new Date(
          data.createdAt.toDate().getTime() + jakartaTimezoneOffset,
        ),
        updatedAt: new Date(
          data.updatedAt.toDate().getTime() + jakartaTimezoneOffset,
        ),
      };
    } catch (error) {
      throw new Error("Error getting document: ", error);
    }
  }

  /**
   * Find all user logs data from Firestore by specifying field and value. You
   * can also specify the order (default to `__name__`) and the direction of the
   * order (default to `asc`).
   *
   * @param {object} query - The query object.
   * @param {string} query.field - The field to query.
   * @param {string} query.value - The value to query.
   * @param {string} [query.orderBy] - The field to order the results by.
   * @param {"asc" | "desc"} [query.orderDirection] - The direction of the
   *   order.
   * @returns {Promise<Object[]>} An array of user logs data.
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

    try {
      if (query.orderBy === undefined) {
        query.orderBy = "__name__";
      }
      if (query.orderDirection === undefined) {
        query.orderDirection = "asc";
      }
      const userLogsDocs = await userLogsCollection
        .where(required.field, "==", required.value)
        .orderBy(query.orderBy, query.orderDirection)
        .get();
      if (userLogsDocs.empty) {
        return [];
      }

      return userLogsDocs.docs
        .map((doc) => doc.data())
        .map((data) => ({
          ...data,
          createdAt: new Date(
            data.createdAt.toDate().getTime() + jakartaTimezoneOffset,
          ),
          updatedAt: new Date(
            data.createdAt.toDate().getTime() + jakartaTimezoneOffset,
          ),
        }));
    } catch (error) {
      throw new Error("Error getting documents: ", error);
    }
  }

  static async update(userLogId, newData) {
    if (!userLogId || typeof userLogId !== "string") {
      throw new TypeError("userLogId must be a valid string!");
    }

    if (!newData || typeof newData !== "object") {
      throw new TypeError("newData must be a valid object!");
    }

    const allowedFields = ["foodId", "isDeleted", "imageUrl"];

    const updates = {};

    for (const [field, value] of Object.entries(newData)) {
      if (!allowedFields.includes(field)) {
        continue;
      }

      if (field === "isDeleted" && typeof value !== "boolean") {
        throw new TypeError("isDeleted must be a valid boolean!");
      }

      if (["foodId", "imageUrl"].includes(field) && typeof value !== "string") {
        throw new TypeError(`${field} must be a valid string!`);
      }

      updates[field] = value;
    }
    if (Object.keys(updates).length === 0) {
      throw new Error("No valid data to update!");
    }

    updates.updatedAt = Timestamp.now();

    try {
      await userLogsCollection.doc(userLogId).update(updates);
      return userLogId;
    } catch (error) {
      throw new Error("Error updating document: ", error);
    }
  }
}

export default UserLog;
