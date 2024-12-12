import Food from "../models/food.model.js";
import axios from "axios";
import FormData from "form-data";
import Bun from "bun";

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

    const response = await axios.post(`${Bun.env.PREDICT_URL}`, form);

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
