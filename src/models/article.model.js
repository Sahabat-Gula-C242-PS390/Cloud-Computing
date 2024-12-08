import db from "../utils/firestore.js";
import { Timestamp } from "@google-cloud/firestore";
import { customCheckField } from "../utils/checkField.js";

const articlesCollection = db.collection("articles");

class Article {
  constructor(data) {
    if (data === undefined || typeof data !== "object") {
      throw new TypeError("data must be a valid object!");
    }

    const required = {
      articleId: data.articleId,
      imageUrl: data.imageUrl,
      title: data.title,
      subtitle: data.subtitle,
      content: data.content,
      originalLink: data.originalLink,
    };

    customCheckField(required);

    this.articleId = data.articleId;
    this.imageUrl = data.imageUrl;
    this.title = data.title;
    this.subtitle = data.subtitle;
    this.content = data.content;
    this.originalLink = data.originalLink;
    this.createdAt = Timestamp.now();
    this.updatedAt = this.createdAt;
  }

  async save() {
    try {
      await articlesCollection.doc(this.articleId).set({
        articleId: this.articleId,
        imageUrl: this.imageUrl,
        title: this.title,
        subtitle: this.subtitle,
        content: this.content,
        originalLink: this.originalLink,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
      });

      return this.articleId;
    } catch (error) {
      throw new Error(`Error adding document: ${error}`);
    }
  }

  static async findById(articleId) {
    try {
      const articleDoc = await articlesCollection.doc(articleId).get();
      if (!articleDoc.exists) {
        return null;
      }

      const data = articleDoc.data();

      return {
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      };
    } catch (error) {
      throw new Error(`Error getting document: ${error}`);
    }
  }

  static async findAll() {
    try {
      const articlesSnapshot = await articlesCollection
        .orderBy("createdAt", "desc")
        .get();

      if (articlesSnapshot.empty) {
        return [];
      }

      return articlesSnapshot.docs
        .map((doc) => doc.data())
        .map((data) => ({
          ...data,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        }));
    } catch (error) {
      throw new Error(`Error getting documents: ${error}`);
    }
  }

  static async findByIdAndDelete(articleId) {
    const required = {
      articleId,
    };
    customCheckField(required);

    const idValidation = await Article.findById(articleId);
    if (!idValidation) {
      throw new Error("ArticleId not found!");
    }

    try {
      await articlesCollection.doc(articleId).delete();
      return (await Article.findById(articleId)) === null;
    } catch (error) {
      throw new Error(`Error deleting article ${articleId}: ${error}`);
    }
  }
}

export default Article;
