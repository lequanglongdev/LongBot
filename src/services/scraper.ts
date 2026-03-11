import axios from 'axios';
import TurndownService from 'turndown';
import * as fs from 'fs';
import * as path from 'path';

const turndownService = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced'
});

interface ZendeskArticle {
    id: number;
    title: string;
    body: string;
    name: string;
    html_url: string;
}

/**
 * @param limit Number of articles to fetch.
 */
export const scrapeArticles = async (limit: number = 30): Promise<ZendeskArticle[]> => {
    const ZENDESK_API = "https://support.optisigns.com/api/v2/help_center/en-us/articles.json";
    const url = `${ZENDESK_API}?per_page=${limit}`;
    try {
        console.log("Starting data scraping from OptiSigns Support...");
        const response = await axios.get(url);
        const articles: ZendeskArticle[] = response.data.articles;
        const dataDir = path.join(process.cwd(), 'data');
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        articles.forEach((article) => {
            const slug = article.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
            const markdownContent = [
                `# ${article.title}`,
                `**Article URL:** ${article.html_url}`,
                `---`,
                turndownService.turndown(article.body)
            ].join('\n\n');
            const filePath = path.join(dataDir, `${slug}.md`);
            fs.writeFileSync(filePath, markdownContent);
            console.log(`File saved: ${slug}.md`);
        });
        console.log(`\nSuccess! Downloaded and processed ${articles.length} articles.`);
        return articles;
    } catch (error) {
        console.error("Scraper Error:", error instanceof Error ? error.message : error);
        throw error;
    }
};