import { QdrantVectorStore } from "@langchain/qdrant";
import { QdrantClient } from "@qdrant/js-client-rest";
import { embeddings } from "./embedding.js";
import dotenv from "dotenv";

dotenv.config();

export const getQdrantClient = () => {
  return new QdrantClient({
    url: process.env.QDRANT_URL,
    apiKey: process.env.QDRANT_API_KEY,
    checkCompatibility: false,
  });
};

export const collectionExists = async (collectionName) => {
  if (!collectionName) return false;
  try {
    const client = getQdrantClient();
    const res = await client.collectionExists(collectionName);
    return res?.exists === true || res === true;
  } catch (error) {
    console.error(`Error checking Qdrant collection ${collectionName}:`, error.message);
    return false;
  }
};

export const vectorStore = async (docs, collectionName) => {
  return await QdrantVectorStore.fromDocuments(docs, embeddings, {
    url: process.env.QDRANT_URL,
    apiKey: process.env.QDRANT_API_KEY,
    collectionName,
  });
};

export const getExistingVectorStore = async (collectionName) => {
  return await QdrantVectorStore.fromExistingCollection(embeddings, {
    url: process.env.QDRANT_URL,
    apiKey: process.env.QDRANT_API_KEY,
    collectionName,
  });
};

export const deleteVectorCollection = async (collectionName) => {
  if (!collectionName) return;
  try {
    const client = getQdrantClient();
    const exists = await collectionExists(collectionName);
    if (exists) {
      await client.deleteCollection(collectionName);
      console.log(`Successfully deleted Qdrant collection: ${collectionName}`);
    }
  } catch (error) {
    console.error(`Error deleting Qdrant collection ${collectionName}:`, error.message);
  }
};