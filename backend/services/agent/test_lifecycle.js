import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
import Document from "./models/document.model.js";
import { pdfRag } from "./agents/pdfRag.agent.js";
import { deleteVectorCollection, collectionExists } from "./config/vectorDb.js";
import fs from "fs";
import path from "path";

async function runTest() {
  console.log("Connecting to MongoDB...");
  await connectDB();

  const testConvId = `test_conv_${Date.now()}`;
  console.log("Using test conversation ID:", testConvId);

  const samplePdfPath = path.resolve("./temp/test_doc.pdf");
  if (!fs.existsSync(path.resolve("./temp"))) {
    fs.mkdirSync(path.resolve("./temp"), { recursive: true });
  }

  const sourcePdf = path.resolve("./temp/1789545289882-Sujan_Resume.pdf");
  if (fs.existsSync(sourcePdf)) {
    fs.copyFileSync(sourcePdf, samplePdfPath);
  } else {
    throw new Error("Source PDF not found for testing");
  }

  console.log("\n--- TEST 1: Question without PDF uploaded ---");
  const stateNoPdf = {
    prompt: "What is the candidate's name?",
    agent: "pdfRag",
    conversationId: testConvId,
    file: null,
  };
  const resNoPdf = await pdfRag(stateNoPdf);
  console.log("Response with no PDF:", resNoPdf.aiResponse);
  if (resNoPdf.aiResponse !== "Please upload a PDF first.") {
    throw new Error("Expected 'Please upload a PDF first.'");
  }

  console.log("\n--- TEST 2: First question WITH PDF uploaded (Upload & Indexing Phase) ---");
  const stateWithPdf = {
    prompt: "What is the candidate's name and experience?",
    agent: "pdfRag",
    conversationId: testConvId,
    file: {
      originalname: "test_doc.pdf",
      mimetype: "application/pdf",
      path: samplePdfPath,
    },
  };
  const resIndexed = await pdfRag(stateWithPdf);
  console.log("Answer from PDF:\n", resIndexed.aiResponse?.slice(0, 150) + "...\n");
  console.log("Created collectionName:", resIndexed.collectionName);
  console.log("Created documentId:", resIndexed.documentId);

  if (!resIndexed.collectionName) {
    throw new Error("Collection name was not created or returned");
  }

  const docInDb = await Document.findOne({ conversationId: testConvId, status: "active" });
  if (!docInDb) {
    throw new Error("Document was not found in MongoDB as active");
  }
  console.log("Document record confirmed in MongoDB:", docInDb.fileName, docInDb.collectionName, docInDb.status);

  const collExists = await collectionExists(resIndexed.collectionName);
  console.log("Qdrant collection exists:", collExists);
  if (!collExists) {
    throw new Error("Qdrant collection was not found in Qdrant");
  }

  console.log("\n--- TEST 3: Subsequent question WITHOUT file (Reuse existing collection) ---");
  const stateSubsequent = {
    prompt: "What skills or technologies are mentioned in the resume?",
    agent: "pdfRag",
    conversationId: testConvId,
    file: null,
  };
  const resSubsequent = await pdfRag(stateSubsequent);
  console.log("Answer on question 2:\n", resSubsequent.aiResponse?.slice(0, 150) + "...\n");
  if (resSubsequent.collectionName !== resIndexed.collectionName) {
    throw new Error("Collection name changed! It should have reused the existing collection.");
  }

  console.log("\n--- TEST 4: Querying for information NOT in the PDF ---");
  const stateUnrelated = {
    prompt: "What is the secret recipe for dark chocolate soufflé with vanilla bean extract?",
    agent: "pdfRag",
    conversationId: testConvId,
    file: null,
  };
  const resUnrelated = await pdfRag(stateUnrelated);
  console.log("Answer for unrelated query:", resUnrelated.aiResponse);
  if (!resUnrelated.aiResponse.includes("I couldn't find this information in the uploaded PDF.")) {
    throw new Error("Expected strict fallback message 'I couldn't find this information in the uploaded PDF.'");
  }

  console.log("\n--- TEST 5: Document Removal / Deletion ---");
  await deleteVectorCollection(docInDb.collectionName);
  docInDb.status = "inactive";
  await docInDb.save();

  const collStillExists = await collectionExists(docInDb.collectionName);
  console.log("Collection still exists after delete:", collStillExists);
  if (collStillExists) {
    throw new Error("Collection should have been deleted from Qdrant");
  }

  console.log("\n--- TEST 6: Question after document removal ---");
  const stateAfterRemoval = {
    prompt: "What is the candidate's name?",
    agent: "pdfRag",
    conversationId: testConvId,
    file: null,
  };
  const resAfterRemoval = await pdfRag(stateAfterRemoval);
  console.log("Response after removal:", resAfterRemoval.aiResponse);
  if (resAfterRemoval.aiResponse !== "Please upload a PDF first.") {
    throw new Error("Expected 'Please upload a PDF first.' after removal");
  }

  await Document.deleteMany({ conversationId: testConvId });
  console.log("Cleaned up test document in MongoDB.");

  console.log("\n==========================================");
  console.log("ALL PDF RAG TESTS PASSED FLAWLESSLY!");
  console.log("==========================================");
  process.exit(0);
}

runTest().catch((err) => {
  console.error("Test failed with error:", err);
  process.exit(1);
});

