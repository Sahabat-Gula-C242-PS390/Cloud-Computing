import db from "../utils/firestore.js";
import { Timestamp } from "@google-cloud/firestore";
import { customCheckField } from "../utils/checkField.js";

const articlesCollection = db.collection("articles");

class Article {
  /**
   * Create a new Article instance
   * 
   * @param {object} data - Article data
   * @param {string} data.articleId - The articleId
   * @param {string} data.imageUrl - The image URL
   * @param {string} data.title - The article title
   * @param {string} data.subtitle - The article subtitle
   * @param {string} data.content - The article content
   * @param {string} data.originalLink - The original article link
   * @throws {TypeError} if data is not a valid object
   * @throws {TypeError} if articleId, imageUrl, title, subtitle, content, or originalLink is not a valid string
   */
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

  /**
   * Save article data to Firestore
   * 
   * @returns {Promise<string>} articleId
   * @throws {Error} if error adding document
   */
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

  /**
   * Update article data in Firestore
   * 
   * @param {articleId} articleId - The articleId
   * @returns {Promise<Object | null>} The article data or null if articleId not found
   * @throws {Error} if error occurs when finding document
   * @throws {TypeError} if articleId is not a valid string
   */
  static async findById(articleId) {
    if (!articleId || typeof articleId !== "string") {
      throw new TypeError("articleId must be a valid string!");
    }

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

  /**
   * Find all articles in Firestore
   * 
   * @returns {Promise<Array<Object>>} An array of article objects
   * @throws {Error} if error occurs when finding documents
   */
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

  /**
   * Update delete article data in Firestore by articleId
   * 
   * @param {string} articleId - The articleId to delete
   * @returns {Promise<boolean>} true if articleId is successfully deleted, false otherwise
   * @throws {Error} if error occurs when deleting document
   * @throws {TypeError} if articleId is not a valid string
   */
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
