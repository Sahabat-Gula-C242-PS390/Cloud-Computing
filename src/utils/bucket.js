import { Storage } from "@google-cloud/storage";
import Bun from "bun";

const storage = new Storage({
  projectId: Bun.env.GCP_PROJECT_ID,
  keyFilename: Bun.env.GCP_SA_KEY,
});

const bucketName = "sahabat-gula.firebasestorage.app";
const bucket = storage.bucket(bucketName);

export async function uploadArticleImage(filePath, articleId) {
  try {
    const [file] = await bucket.upload(filePath, {
      destination: "articles/" + articleId + ".jpg",
      preconditionOpts: { ifGenerationMatch: 0 },
      metadata: {
        cacheControl: "public, max-age=31536000",
      },
    });

    await file.makePublic();

    return `https://storage.googleapis.com/${bucketName}/articles/${articleId}.jpg`;
  } catch (error) {
    throw new Error(`Error uploading file: ${error}`);
  }
}

export async function deleteArticleImage(articleId) {
  try {
    const file = bucket.file("articles/" + articleId + ".jpg");

    await file.delete();
  } catch (error) {
    throw new Error(`Error deleting file: ${error}`);
  }
}

console.log("Using project ID for Bucket: " + Bun.env.GCP_PROJECT_ID);
console.log("Using service account key for Bucket: " + Bun.env.GCP_SA_KEY);
