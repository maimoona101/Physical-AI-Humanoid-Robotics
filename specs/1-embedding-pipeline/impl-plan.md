# Implementation Plan: Embedding Pipeline for Docusaurus Content

## Technical Context

### Project Structure
- Backend folder: `/backend`
- Package manager: UV (alternative to pip)
- Main file: `main.py`
- Target URL: https://physical-ai-humanoid-robotics-ochre.vercel.app/
- SiteMap URL: https://physical-ai-humanoid-robotics-ochre.vercel.app/sitemap.xml

### Required Components
- Cohere client for embedding generation
- Qdrant client for vector storage
- Web scraping/crawling capabilities
- Text processing and chunking
- Vector database collection named "rag_embedding"

### Core Functions to Implement
1. `get_all_urls` - Discover all URLs from the target site
2. `extract_text_from_url` - Extract clean text content from a single URL
3. `chunk_text` - Split large text into smaller chunks
4. `embed` - Generate embeddings using Cohere API
5. `create_collection` - Initialize Qdrant collection named "rag_embedding"
6. `save_chunk_to_qdrant` - Store embeddings with metadata
7. `main` function - Execute the complete pipeline

### Dependencies to Install
- cohere
- qdrant-client
- requests
- beautifulsoup4
- python-dotenv (for environment management)

## Architecture Overview

The system will be a single-file Python application that:
1. Discovers all accessible URLs on the target Docusaurus site
2. Extracts clean text content from each URL
3. Chunks the text into manageable pieces
4. Generates embeddings using Cohere's API
5. Stores embeddings in Qdrant vector database with metadata

## Implementation Strategy

The main.py file will follow a sequential execution pattern:
1. Initialize Cohere and Qdrant clients
2. Create the rag_embedding collection in Qdrant
3. Crawl the website to get all URLs
4. Process each URL: extract text → chunk → embed → save to Qdrant
5. Handle errors gracefully and log progress

## Success Criteria

- Successfully extract content from target website
- Generate embeddings for all pages
- Store embeddings in Qdrant with proper metadata
- Handle errors gracefully
- Complete processing within reasonable time