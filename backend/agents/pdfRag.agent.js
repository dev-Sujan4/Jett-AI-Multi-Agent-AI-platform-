import fs from "fs";
import { PDFParse } from "pdf-parse";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { vectorStore, getExistingVectorStore, deleteVectorCollection } from "../config/vectorDb.js";
import { getModel } from "../config/llmModels.js";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import Document from "../models/document.model.js";
import mongoose from "mongoose";

const isPdfFile = (file) => {
  if (!file) return false;
  return (
    file.mimetype === "application/pdf" ||
    /\.pdf$/i.test(file.originalname || "")
  );
};

export const pdfRag = async (state) => {
  let tempFilePath = state.file?.path;

  try {
    // If router already determined that no PDF was provided, return the message immediately
    if (state.aiResponse && state.aiResponse.includes("Please upload a PDF first")) {
      return state;
    }

    const conversationId = state.conversationId;
    let activeDoc = null;

    if (conversationId) {
      activeDoc = await Document.findOne({
        conversationId,
        status: "active",
      }).sort({ createdAt: -1 });
    }

    let collectionName = activeDoc?.collectionName;
    let documentId = activeDoc?.documentId;

    // ========================================
    // UPLOAD PHASE (Index ONLY ONCE per uploaded PDF)
    // ========================================
    if (isPdfFile(state.file) && tempFilePath && fs.existsSync(tempFilePath)) {
      const isSameFileAlreadyActive =
        activeDoc &&
        activeDoc.fileName === state.file.originalname &&
        activeDoc.collectionName;

      if (!isSameFileAlreadyActive) {
        // A new PDF is being uploaded. Clean up any previous active collection for this conversation.
        if (activeDoc) {
          try {
            await deleteVectorCollection(activeDoc.collectionName);
            activeDoc.status = "inactive";
            await activeDoc.save();
          } catch (cleanErr) {
            console.warn("Failed to cleanup previous active PDF collection:", cleanErr.message);
          }
        }

        console.log(`[PDF RAG] Indexing new PDF: ${state.file.originalname}`);

        const buffer = fs.readFileSync(tempFilePath);
        const pdf = new PDFParse({ data: buffer });
        const result = await pdf.getText();
        const text = result?.text || "";

        if (!text.trim()) {
          return {
            ...state,
            aiResponse: "I couldn't extract any readable text from the uploaded PDF.",
          };
        }

        const splitter = new RecursiveCharacterTextSplitter({
          chunkSize: 1000,
          chunkOverlap: 200,
        });

        const docs = await splitter.createDocuments([text]);

        // Generate clean alphanumeric Qdrant collection name
        const sanitizedConvId = (conversationId || "conv").replace(/[^a-zA-Z0-9_-]/g, "");
        const newCollectionName = `pdf_${sanitizedConvId}_${Date.now()}`;

        // Create embeddings and Qdrant collection ONCE
        await vectorStore(docs, newCollectionName);

        const newDocId = new mongoose.Types.ObjectId().toString();

        const createdDoc = await Document.create({
          documentId: newDocId,
          conversationId: conversationId || newDocId,
          fileName: state.file.originalname,
          mimeType: state.file.mimetype || "application/pdf",
          collectionName: newCollectionName,
          status: "active",
        });

        collectionName = createdDoc.collectionName;
        documentId = createdDoc.documentId;
        console.log(`[PDF RAG] Indexed successfully into collection: ${collectionName}`);
      } else {
        console.log(`[PDF RAG] Reusing existing indexed collection: ${collectionName}`);
      }
    }

    // ========================================
    // QUESTION PHASE (Reuses existing Qdrant collection)
    // ========================================
    if (!collectionName) {
      return {
        ...state,
        aiResponse: "Please upload a PDF first.",
      };
    }

    console.log(`[PDF RAG] Querying existing collection: ${collectionName}`);
    const store = await getExistingVectorStore(collectionName);
    const relevantDocs = await store.similaritySearch(state.prompt, 5);

    const context = relevantDocs.map((d) => d.pageContent).join("\n\n");

    if (!context || !context.trim()) {
      return {
        ...state,
        documentId,
        collectionName,
        aiResponse: "I couldn't find this information in the uploaded PDF.",
      };
    }

    const llm = await getModel("pdfRag");

    const messages = [
      new SystemMessage(`You are JettAI PDF Assistant. You are a strict retrieval-augmented question answering engine.

STRICT RULES:
- Answer ONLY using the facts explicitly stated in the provided PDF Context.
- NEVER use outside knowledge, training knowledge, or assumptions.
- NEVER perform web search or refer to external sources.
- NEVER use conversation history as factual context.
- If the exact answer is not present in the provided PDF Context, you MUST return EXACTLY:
"I couldn't find this information in the uploaded PDF."
- Do not apologize, explain why it is missing, or provide external answers. If the information is not in the context, return ONLY:
"I couldn't find this information in the uploaded PDF."
- When the answer is found in the context, use clean Markdown formatting.`),
      new HumanMessage(`PDF Context:
${context}

Question: ${state.prompt}`),
    ];

    const response = await llm.invoke(messages);

    return {
      ...state,
      documentId,
      collectionName,
      aiResponse: response.content,
    };
  } catch (error) {
    console.error("[PDF RAG Error]:", error);
    return {
      ...state,
      aiResponse: "An error occurred while processing the PDF. Please try again.",
    };
  } finally {
    // Safe temp file cleanup so missing files never throw
    try {
      if (tempFilePath && fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
    } catch (cleanupErr) {
      console.warn("[PDF RAG Cleanup]: Could not remove temp file:", cleanupErr.message);
    }
  }
};