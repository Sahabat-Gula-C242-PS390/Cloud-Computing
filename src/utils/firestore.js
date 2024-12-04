import { Firestore } from "@google-cloud/firestore";
import Bun from "bun";

const db = new Firestore({
  projectId: Bun.env.GCP_PROJECT_ID,
  keyFilename: Bun.env.GCP_SA_KEY,
});

console.log("Using project ID for Firestore: " + process.env.GCP_PROJECT_ID);
console.log(
  "Using service account key for Firestore: " + process.env.GCP_SA_KEY,
);

export default db;
