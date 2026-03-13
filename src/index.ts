import * as dotenv from 'dotenv';
import { scrapeArticles } from './services/scraper';
import { setupOptiBot } from './services/openai';

dotenv.config();
console.log("RAW:", JSON.stringify(process.env.OPENAI_API_KEY));
console.log("LEN:", process.env.OPENAI_API_KEY?.length);
console.log("KEY LENGTH:", process.env.OPENAI_API_KEY?.length);
console.log("KEY PREFIX:", process.env.OPENAI_API_KEY?.slice(0,10));
async function bootstrap() {
    try {
        console.log("--- STARTING OPTIBOT SETUP WORKFLOW ---");

        await scrapeArticles(30);
        const botConfig = await setupOptiBot();

        console.log("\n--- DEPLOYMENT SUCCESSFUL ---");
        console.log(`Assistant ID: ${botConfig.assistantId}`);
        console.log("You can now test this ID in the OpenAI Playground.");

    } catch (error) {
        console.error("--- WORKFLOW FAILED ---");
        console.error(error);
        process.exit(1);
    }
}

bootstrap();