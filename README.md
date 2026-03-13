# LongBot
A specialized Customer Support Assistant built for OptiSigns, leveraging Retrieval-Augmented Generation (RAG) to provide accurate answers based on official documentation.

# Overview
This project automates the process of extracting knowledge from the OptiSigns Support Center, processing it into clean formats, and powering an AI Assistant via OpenAI's latest API (v2).
Current Status: 
                Phase 1 Complete (03/11/2026 ~2h:8h-10h)
                Phase 2 Complete (03/13/2026 ~3h:14h-17h)
Knowledge Extraction: Successfully implemented a scraper that fetches articles from support.optisigns.com.
Data Standardization: Converting complex HTML structures into "AI-ready" Markdown files.

# Tech Stack
Language: TypeScript (Node.js)
Networking: Axios - For robust API communication with Zendesk.
Content Transformation: Turndown - To ensure clean, hierarchical Markdown output.
Environment Management: Dotenv - For secure API key handling.

# Project Structure
LONGBOT/
├── data/                # Scrape Data
├── node_modules/
├── src/
│   ├── services/
│   │   ├── openai.ts    # Handle assistant / embedding / chat
│   │   └── scraper.ts   # Scrape Articles
│   ├── utils/
│   │   └── index.ts     
├── test/
│   ├── test-assistgant.ts # Test Assistant Response
│   └── test-client.ts     # Test API Client
├── .env                   # (API keys, config)
├── package.json
└── tsconfig.json