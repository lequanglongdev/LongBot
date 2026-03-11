import * as dotenv from 'dotenv';
import { scrapeArticles } from './services/scraper';

dotenv.config();

async function bootstrap() {
    try {
        console.log("--- Phase 1: Knowledge Extraction ---");
        
        const articles = await scrapeArticles(30);
        
        if (articles.length > 0) {
            console.log("\nNext step: Ready to synchronize with OpenAI Vector Store.");
        } else {
            console.warn("No articles found to process.");
        }

    } catch (error) {
        console.error("System Failure:", error);
        process.exit(1);
    }
}
bootstrap();