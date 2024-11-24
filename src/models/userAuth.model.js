import db from "../utils/firestore.js";
import { Timestamp } from "@google-cloud/firestore";
import { randomInt } from "crypto";

const usersAuthCollection = db.collection("usersAuth");

class UserAuth {
  constructor(data) {
    if (data === undefined || typeof data !== "object") {
      throw new TypeError("data must be a valid object!");
    }

    this.email = data.email;
    this.name = data.name;
    this.password = data.password;
    this.otpCode = randomInt(100000, 999999);
    this.expiredAt = Timestamp.fromDate(new Date(Date.now() + 10 * 60 * 1000));
  }

  async save() {
    try {
      await usersAuthCollection.doc(this.email).set({
        email: this.email,
        name: this.name,
        password: this.password,
        otpCode: this.otpCode,
        expiredAt: this.expiredAt,
      });
      return this.email;
    } catch (error) {
      throw new Error("Error creating user:", error);
    }
  }

  static async findByEmail(email) {
    if (!email || typeof email !== "string") {
      throw new TypeError("email must be a valid string!");
    }
    try {
      const userDoc = await usersAuthCollection.doc(email).get();
      return userDoc.data();
    } catch (error) {
      throw new Error(`Error finding user ${email}:`, error);
    }
  }

  // Development helper method
  static async deleteAll() {
    try {
      // console.log("Deleting all documents in batches...");
      const batchSize = 100;
      let query = usersAuthCollection.limit(batchSize);

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

export default UserAuth;
