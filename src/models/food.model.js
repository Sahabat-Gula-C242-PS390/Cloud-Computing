import db from "../utils/firestore.js";
import { Timestamp } from "@google-cloud/firestore";
import { foodCheckField } from "../utils/checkField.js";

const foodCollection = db.collection("foods");

class Food {
  /**
   * Create a new Food instance
   * 
   * @param {object} data - Food data
   * @param {string} data.foodId - The foodId or food label
   * @param {string} data.name - The food name
   * @param {number} data.gula - The sugar content in grams
   * @param {number} data.karbohidrat - The carbohydrate content in grams
   * @param {number} data.protein - The protein content in grams
   * @param {number} data.lemak - The fat content in grams
   * @throws {TypeError} if data is not a valid object
   * @throws {TypeError} if foodId, name, gula, karbohidrat, protein, or lemak is not a valid string or number
   */
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

  /**
   * Save food data to Firestore
   * 
   * @returns {Promise<string>} foodId
   * @throws {Error} if error adding document
   */
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

  /**
   * Find food nutrition data by foodId. If not found, return null
   * 
   * @param {string} foodId - The foodId to find
   * @returns {Promise<object|null>} food nutrition data
   * @throws {Error} if error getting document
   * @throws {TypeError} if foodId is not a string
   */
  static async findById(foodId) {
    if (!foodId || typeof foodId !== "string") {
      throw new TypeError("foodId must be a valid string!");
    }
    
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
