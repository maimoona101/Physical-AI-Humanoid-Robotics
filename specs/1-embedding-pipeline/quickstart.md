# Quickstart Guide: Embedding Pipeline

## Prerequisites

- Python 3.8+
- UV package manager installed (`pip install uv`)

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd <repo-directory>
   ```

2. **Navigate to backend directory**
   ```bash
   cd backend
   ```

3. **Install dependencies using UV**
   ```bash
   uv pip install -r requirements.txt
   ```

4. **Set up environment variables**

   Create a `.env` file in the backend directory with the following:
   ```env
   COHERE_API_KEY=your_cohere_api_key_here
   QDRANT_URL=localhost  # or your Qdrant instance URL
   QDRANT_API_KEY=your_qdrant_api_key_here  # if using Qdrant Cloud
   ```

5. **Run the embedding pipeline**
   ```bash
   python main.py
   ```

## Configuration Options

- Modify `max_pages` in `get_all_urls()` to control how many pages to crawl
- Adjust `chunk_size` and `overlap` in `chunk_text()` to change how content is split
- Change the Cohere model in the `embed()` method if needed

## Expected Output

- The pipeline will crawl the target website and extract content
- Text will be chunked and converted to embeddings
- Embeddings will be stored in the "rag_embedding" collection in Qdrant
- Progress will be logged to the console

## Troubleshooting

- If you get API rate limit errors, reduce the crawling speed by increasing sleep times
- If Qdrant connection fails, verify your QDRant instance is running
- If content extraction fails for certain pages, adjust the selectors in `extract_text_from_url()`