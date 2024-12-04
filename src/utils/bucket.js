import { Storage } from "@google-cloud/storage";
import Bun from "bun";

const storage = new Storage({
  projectId: Bun.env.GCP_PROJECT_ID,
  keyFilename: Bun.env.GCP_SA_KEY,
});

const bucketName = "sahabat-gula.firebasestorage.app";
const bucket = storage.bucket(bucketName);

export async function uploadArticleImage(filePath, articleId) {
  const [file] = await bucket.upload(filePath, {
    destination: "articles/" + articleId + ".jpg",
    preconditionOpts: { ifGenerationMatch: 0 },
    metadata: {
      cacheControl: "public, max-age=31536000",
    },
  });

  await file.makePublic();

  return `https://storage.googleapis.com/${bucketName}/articles/${articleId}.jpg`;
}

console.log("Using project ID for Bucket: " + Bun.env.GCP_PROJECT_ID);
console.log("Using service account key for Bucket: " + Bun.env.GCP_SA_KEY);
