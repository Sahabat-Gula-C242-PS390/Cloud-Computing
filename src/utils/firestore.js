import { Firestore } from "@google-cloud/firestore";

const db = new Firestore({
  projectId: process.env.GCP_PROJECT_ID,
  keyFilename: process.env.GCP_SA_KEY,
});

console.log("Using project ID: " + process.env.GCP_PROJECT_ID);
console.log("Using service account key: " + process.env.GCP_SA_KEY);

export default db;
