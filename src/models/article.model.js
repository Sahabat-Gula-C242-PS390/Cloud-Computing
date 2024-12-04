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
    };

    customCheckField(required);

    this.articleId = data.articleId;
    this.imageUrl = data.imageUrl;
    this.title = data.title;
    this.subtitle = data.subtitle;
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
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
      });

      return this.articleId;
    } catch (error) {
      throw new Error(`Error adding document: ${error}`);
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
}

export default Article;
