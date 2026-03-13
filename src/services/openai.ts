import OpenAI from "openai";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Setup OptiBot
 * - Create Vector Store
 * - Upload markdown docs
 * - Create Assistant with file_search
 */
export const setupOptiBot = async () => {
  try {
    console.log("Initializing AI Knowledge Base...");

    const vectorStore = await openai.vectorStores.create({
  name: "OptiSigns Documentation Store",
});

    console.log("Vector Store ID:", vectorStore.id);

    const dataDir = path.join(process.cwd(), "data");

    if (!fs.existsSync(dataDir)) {
      throw new Error(
        "Data directory not found. Please run the scraper first."
      );
    }

    const fileNames = fs
      .readdirSync(dataDir)
      .filter((file) => file.endsWith(".md"));

    if (fileNames.length === 0) {
      throw new Error("No .md files found in the data directory.");
    }

    const fileStreams = fileNames.map((fileName) =>
      fs.createReadStream(path.join(dataDir, fileName))
    );

    console.log(`Uploading ${fileStreams.length} files...`);

    const fileBatch = await openai.vectorStores.fileBatches.uploadAndPoll(
  vectorStore.id,
  {
    files: fileStreams,
  }
);

    console.log("Files indexed successfully");
    console.log("Upload status:", fileBatch.status);
    console.log("File counts:", fileBatch.file_counts);

    const assistant = await openai.beta.assistants.create({
      name: "OptiBot",
      instructions: `You are OptiBot, the customer-support bot for OptiSigns.com.
            Tone: helpful, factual, concise.
            Only answer using the uploaded docs.
            Max 5 bullet points; else link to the doc.
            Cite up to 3 "Article URL:" lines per reply.`,
      model: "gpt-4o-mini",
      tools: [{ type: "file_search" }],
      tool_resources: {
        file_search: {
          vector_store_ids: [vectorStore.id],
        },
      },
    });

    console.log("\nOptiBot Ready!");
    console.log("Assistant ID:", assistant.id);

    return {
      assistantId: assistant.id,
      vectorStoreId: vectorStore.id,
    };
  } catch (error) {
    console.error(
      "OpenAI Setup Error:",
      error instanceof Error ? error.message : error
    );
    throw error;
  }
};