import db from "../utils/firestore.js";
import { Timestamp } from "@google-cloud/firestore";
import { foodCheckField } from "../utils/checkField.js";

const foodCollection = db.collection("foods");

class Food {
  constructor(data) {
    if (data === undefined || typeof data !== "object") {
      throw new TypeError("data must be a valid object!");
    }

    const required = {
      foodId: data.foodId,
      name: data.name,
      gula: data.gula,
      karbohidrat: data.karbohidrat,
      protein: data.protein,
      lemak: data.lemak,
    };

    foodCheckField(required);

    this.foodId = data.foodId;
    this.name = data.name;
    this.gula = data.gula;
    this.karbohidrat = data.karbohidrat;
    this.protein = data.protein;
    this.lemak = data.lemak;
    this.createdAt = Timestamp.now();
    this.updatedAt = this.createdAt;
  }

  async save() {
    try {
      await foodCollection.doc(this.foodId).set({
        foodId: this.foodId,
        name: this.name,
        gula: this.gula,
        karbohidrat: this.karbohidrat,
        protein: this.protein,
        lemak: this.lemak,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
      });

      return this.foodId;
    } catch (error) {
      throw new Error(`Error adding document: ${error}`);
    }
  }

  static async findById(foodId) {
    try {
      const foodDoc = await foodCollection.doc(foodId).get();
      if (!foodDoc.exists) {
        return null;
      }

      const data = foodDoc.data();

      return {
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      };
    } catch (error) {
      throw new Error(`Error getting document: ${error}`);
    }
  }
}

export default Food;
