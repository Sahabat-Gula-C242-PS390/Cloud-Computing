import Article from "../models/article.model.js";
import { randomUUIDv7 } from "bun";
import * as path from "node:path";
import * as fs from "node:fs/promises";
import { deleteArticleImage, uploadArticleImage } from "../utils/bucket.js";

export async function getAllArticles(request, h) {
  try {
    const articles = await Article.findAll();

    // Content should not be returned
    const articlesData = articles.map(
      // eslint-disable-next-line no-unused-vars
      ({ content, ...articleDoc }) => articleDoc,
    );

    return h.response({ status: "success", data: articlesData }).code(200);
  } catch (error) {
    return h.response({ status: "failed", error: error.message }).code(400);
  }
}

export async function getArticle(request, h) {
  try {
    const { articleId } = request.params;

    const article = await Article.findById(articleId);
    if (!article) {
      return h
        .response({ status: "failed", error: "Article not found!" })
        .code(404);
    }

    return h.response({ status: "success", data: article }).code(200);
  } catch (error) {
    return h.response({ status: "failed", error: error.message }).code(400);
  }
}

export async function createArticle(request, h) {
  try {
    const { image, title, subtitle, content, originalLink } = request.payload;
    // console.log("Request payload received");

    const articleId = randomUUIDv7();

    const tempDir = path.join(process.cwd(), "temp");
    await fs.mkdir(tempDir, { recursive: true });

    const tempFilePath = path.join(process.cwd(), "temp", `${articleId}.jpg`);

    const fileStream = image._data;
    await fs.writeFile(tempFilePath, fileStream);
    // console.log("File uploaded to temp directory");

    const imageUrl = await uploadArticleImage(tempFilePath, articleId);
    // console.log("File uploaded to GCS");

    await fs.unlink(tempFilePath);
    // console.log("File deleted from tempFilePath");

    const article = new Article({
      articleId,
      imageUrl,
      title,
      subtitle,
      content,
      originalLink,
    });

    const realArticleId = await article.save();

    return h
      .response({
        status: "success",
        data: {
          articleId: realArticleId,
          imageUrl,
          title,
          subtitle,
          content,
          originalLink,
        },
      })
      .code(201);
  } catch (error) {
    return h.response({ status: "failed", error: error.message }).code(400);
  }
}

export async function deleteArticle(request, h) {
  try {
    const { articleId } = request.params;

    const article = await Article.findById(articleId);
    if (!article) {
      return h
        .response({ status: "failed", error: "Article not found!" })
        .code(404);
    }

    await deleteArticleImage(articleId);

    const result = await Article.findByIdAndDelete(articleId);
    if (!result) {
      return h
        .response({ status: "failed", error: "Article not deleted!" })
        .code(400);
    }

    return h.response({ status: "success" }).code(200);
  } catch (error) {
    return h.response({ status: "failed", error: error.message }).code(400);
  }
}
