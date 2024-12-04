import Article from "../models/article.model.js";
import { randomUUIDv7 } from "bun";
import * as path from "node:path";
import * as fs from "node:fs/promises";
import { uploadArticleImage } from "../utils/bucket.js";

export async function getArticles(request, h) {
  try {
    const articles = await Article.findAll();

    return h.response({ status: "success", data: articles }).code(200);
  } catch (error) {
    return h.response({ status: "failed", error: error.message }).code(400);
  }
}

export async function createArticle(request, h) {
  try {
    const { image, title, subtitle } = request.payload;

    const articleId = randomUUIDv7();
    const tempFilePath = path.join(process.cwd(), "temp", `${articleId}.jpg`);

    const fileStream = image._data;

    await fs.writeFile(tempFilePath, fileStream);

    const imageUrl = await uploadArticleImage(tempFilePath, articleId);

    await fs.unlink(tempFilePath);

    const article = new Article({
      articleId,
      imageUrl,
      title,
      subtitle,
    });

    const realArticleId = await article.save();

    return h
      .response({
        status: "success",
        data: { articleId: realArticleId, imageUrl, title, subtitle },
      })
      .code(201);
  } catch (error) {
    return h.response({ status: "failed", error: error.message }).code(400);
  }
}
