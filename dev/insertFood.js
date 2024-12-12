import Food from "../src/models/food.model.js";
import fs from "fs";
import csv from "csv-parser";
import path from "path";

const filePath = path.join(__dirname, "food.csv");
const results = [];

fs.createReadStream(filePath)
  .pipe(csv())
  .on("data", (data) => {
    const foodData = {
      foodId: data.image_name,
      name: data.image_name.replace(/-/g, " "),
      gula: parseFloat(data.glucose),
      karbohidrat: parseFloat(data.karbohidrat),
      protein: parseFloat(data.protein),
      lemak: parseFloat(data.lemak),
    };
    results.push(foodData);
  })
  .on("end", async () => {
    for (const item of results) {
      for (const item of results) {
        const food = new Food(item);
        await food.save();
      }
    }
    console.log("Food data loaded successfully");
  });
