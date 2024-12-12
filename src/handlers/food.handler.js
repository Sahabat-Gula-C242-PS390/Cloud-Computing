import Food from "../models/food.model.js";
import axios from "axios";
import FormData from "form-data";
import { randomUUIDv7, env } from "bun";
import UserLog from "../models/userLog.model.js";
import * as path from "path";
import * as fs from "fs/promises";
import { uploadUserLogImage } from "../utils/bucket.js";

export async function savePredictFood(request, h) {
  try {
    const { userId } = request.params;
    const { label, image } = request.payload;

    const userLogId = randomUUIDv7();

    const tempDir = path.join(process.cwd(), "temp");
    await fs.mkdir(tempDir, { recursive: true });
    const tempFilePath = path.join(process.cwd(), "temp", `${userLogId}.jpg`);
    const fileStream = image._data;
    await fs.writeFile(tempFilePath, fileStream);

    const imageUrl = await uploadUserLogImage(tempFilePath, userLogId);
    await fs.unlink(tempFilePath);

    const userLog = new UserLog({
      userLogId,
      userId,
      foodId: label,
      imageUrl,
    });
    await userLog.save();

    return h.response({ status: "success", foodId: label }).code(201);
  } catch (error) {
    return h.response({ status: "failed", error: error.message }).code(400);
  }
}

export async function predictFood(request, h) {
  try {
    const { image } = request.payload;

    if (!image) {
      return h
        .response({ status: "failed", error: "Image file is required!" })
        .code(400);
    }

    if (!image.hapi.headers["content-type"].startsWith("image/")) {
      return h
        .response({ status: "failed", error: "Only image files are allowed!" })
        .code(400);
    }
    if (image._data.length > 10 * 1024 * 1024) {
      return h
        .response({
          status: "failed",
          error: "Image size must be less than 10 MB!",
        })
        .code(400);
    }

    const form = new FormData();
    form.append("image", image._data, {
      filename: image.hapi.filename,
    });

    const response = await axios.post(`${env.PREDICT_URL}`, form);

    const result = response.data.data;
    const updatedResult = await Promise.all(
      result.map(async (item) => {
        const nutrition = await Food.findById(item.label);
        return {
          ...item,
          name: nutrition.name,
          gula: nutrition.gula,
          karbohidrat: nutrition.karbohidrat,
          lemak: nutrition.lemak,
          protein: nutrition.protein,
        };
      }),
    );

    return h.response({ status: "success", data: updatedResult }).code(200);
  } catch (error) {
    return h.response({ status: "failed", error: error.message }).code(400);
  }
}
