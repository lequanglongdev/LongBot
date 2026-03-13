import fs from "fs";
import path from "path";
import crypto from "crypto";
import { scrapeArticles } from "../services/scraper";

const metaFile = path.join("data", "article-meta.json");

function hash(content: string) {
  return crypto.createHash("md5").update(content).digest("hex");
}

async function runDailyScraper() {

  console.log("Job started:", new Date().toISOString(), "\n");

  const articles = await scrapeArticles();

  let meta: Record<string,string> = {};

  if (fs.existsSync(metaFile)) {
    meta = JSON.parse(fs.readFileSync(metaFile, "utf-8"));
  }

  let added = 0;
  let updated = 0;
  let skipped = 0;

  for (const article of articles) {

    const key = article.html_url;
    const contentHash = hash(article.body);

    if (!meta[key]) {

      meta[key] = contentHash;
      added++;

      console.log("NEW:", article.title);
    } 
    else if (meta[key] !== contentHash) {

      meta[key] = contentHash;
      updated++;

      console.log("UPDATED:", article.title);
    } 
    else {

      skipped++;
    }
  }

  fs.writeFileSync(metaFile, JSON.stringify(meta, null, 2));

  console.log("\n--- DAILY JOB SUMMARY ---");

  console.log("Articles scanned:", articles.length);
  console.log("added:", added);
  console.log("updated:", updated);
  console.log("skipped:", skipped);
  console.log("\nJob finished:", new Date().toISOString());
}

runDailyScraper();