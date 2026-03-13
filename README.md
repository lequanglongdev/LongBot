# LongBot – CompanyBot Mini Clone
LongBot is a mini AI support assistant that answers questions about OptiSigns using real documentation from the OptiSigns Support Center.
The system automatically scrapes articles, builds a vector knowledge base, and allows users to ask questions via a CLI chatbot powered by OpenAI.

---

# Features

### 1. Article Scraper
Scrapes articles from the OptiSigns Support Center (Zendesk).
Extracts article title and content.
Saves articles locally as markdown files.

### 2. AI Knowledge Base
Articles are uploaded to an OpenAI Vector Store.
The assistant uses Retrieval-Augmented Generation (RAG) to answer questions.

### 3. CLI Chatbot
Users can ask questions directly from the terminal.
Example:
You: How do I add a YouTube video?
Bot:  To add a YouTube video in OptiSigns, follow these steps:...

### 4. Delta Detection
The system detects article changes using MD5 hashes.
Daily job logic:
    Re-scrape articles
    Detect new or updated content
    Upload only the delta
    Skip unchanged articles

### 5. Automated Daily Job
A scheduled job runs once per day to keep the knowledge base up to date.

---

# Project Structure
```
LONGBOT
│
├── data/                 # Scraped articles
├── src/
│   ├── services/
│   │   ├── scraper.ts    # Scrape Zendesk articles
│   │   └── openai.ts     # OpenAI assistant + vector store
│   │
│   ├── jobs/
│   │   └── dailyScraper.ts   # Daily scheduled scraper job
│   │
│   └── utils/
│
├── test/
│   ├── test-assistant.ts
│   └── test-client.ts
│
├── Dockerfile
├── package.json
└── tsconfig.json
```

---

# Installation
Clone repository
```
git clone <repo-url>
cd longbot
```
Install dependencies
```
npm install
```
Create `.env`
```
OPENAI_API_KEY=your_openai_api_key
```

---

# Run Scraper
```
npm run start
```
This will:
Scrape OptiSigns support articles
Upload them to the vector store

---

# Run Chatbot (CLI)
```
ts-node test/test-client.ts
```
Example:
```
You: How do I set up a PowerBI dashboard?
Bot: To set up PowerBI in OptiSigns you must first create a service principal...
```
---

# Run Daily Scraper Job
```
npm run scraper:daily
```
Example output:
```
Job started: 2026-03-13T11:16:07Z
Success! Downloaded and processed 30 articles.

--- DAILY JOB SUMMARY ---
Articles scanned: 30
added: 0
updated: 1
skipped: 29
```

---

# Docker
Build image
```
docker build -t longbot-job .
```
Run container
```
docker run --env-file .env longbot-job
```
---

# DigitalOcean Scheduled Job
The scraper is deployed as a scheduled job on DigitalOcean App Platform.
Schedule:
Runs once per day
Command: `npm run scraper:daily`
Job logs example:
```
Articles scanned: 30
added: 0
updated: 0
skipped: 30
```
---

# Technologies Used
Node.js
TypeScript
OpenAI Assistants API
Vector Store (RAG)
Docker
DigitalOcean App Platform

---

# Future Improvements
Parallel scraping for faster article processing
Web UI for chatbot interaction
Improved article chunking for better retrieval
Monitoring and alerting for scraper failures

---

# Author
Long – Software Engineering Student
This project was built as part of the LongBot take-home assignment.
Current Status: 
    Phase 1 Complete (03/11/2026 ~2h:8h-10h) 
    Phase 2 Complete (03/13/2026 ~3h:14h-17h)
    Phase 3 Complete (03/13/2026 ~1h30: 17h-18h30)