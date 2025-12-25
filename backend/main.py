import os
import time
import uuid
import asyncio
import logging
from typing import List, Optional
from dataclasses import dataclass

import requests
import httpx
import cohere
from dotenv import load_dotenv
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from qdrant_client import QdrantClient
from qdrant_client.http import models

# ----------------- Setup -----------------
load_dotenv()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="RAG Pipeline API")

# ----------------- Enable CORS -----------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ya specific origin ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------- Data Classes -----------------
@dataclass
class DocumentContent:
    url: str
    title: str
    content: str
    created_at: float = time.time()

@dataclass
class TextChunk:
    id: str
    document_url: str
    content: str
    chunk_index: int
    metadata: dict

# ----------------- Helpers -----------------
def get_all_urls(base_url: str) -> List[str]:
    urls = set()
    try:
        r = requests.get(base_url)
        r.raise_for_status()
        soup = BeautifulSoup(r.content, "html.parser")
        for link in soup.find_all("a", href=True):
            full_url = urljoin(base_url, link["href"])
            if urlparse(full_url).netloc == urlparse(base_url).netloc:
                urls.add(full_url)
        return list(urls)
    except Exception as e:
        logger.error(f"URL discovery error: {e}")
        return []

def extract_text_from_url(url: str) -> Optional[DocumentContent]:
    try:
        r = requests.get(url)
        r.raise_for_status()
        soup = BeautifulSoup(r.content, "html.parser")
        for tag in soup(["script", "style", "nav", "header", "footer", "aside"]):
            tag.decompose()
        title = soup.title.get_text(strip=True) if soup.title else url
        content = " ".join(soup.get_text(separator=" ").split())
        if not content:
            return None
        return DocumentContent(url=url, title=title, content=content)
    except Exception as e:
        logger.error(f"Extract error {url}: {e}")
        return None

def chunk_text(text: str, size: int = 512, overlap: int = 100) -> List[TextChunk]:
    chunks = []
    start = 0
    idx = 0
    while start < len(text):
        end = min(start + size, len(text))
        chunks.append(
            TextChunk(
                id=str(uuid.uuid4()),
                document_url="",
                content=text[start:end],
                chunk_index=idx,
                metadata={"created_at": time.time()}
            )
        )
        start = end - overlap
        idx += 1
    return chunks

def embed_texts(texts: List[str]) -> List[List[float]]:
    co = cohere.Client(os.getenv("COHERE_API_KEY"))
    res = co.embed(
        texts=texts,
        model="embed-english-v3.0",
        input_type="search_document"
    )
    return res.embeddings

def ensure_collection(client: QdrantClient):
    cols = [c.name for c in client.get_collections().collections]
    if "rag_embedding" not in cols:
        client.create_collection(
            collection_name="rag_embedding",
            vectors_config=models.VectorParams(
                size=1024,
                distance=models.Distance.COSINE
            )
        )

# ----------------- Pipeline -----------------
async def run_pipeline(limit: int = 10):
    qdrant_url = os.getenv("QDRANT_URL")
    qdrant_key = os.getenv("QDRANT_API_KEY")
    client = QdrantClient(url=qdrant_url, api_key=qdrant_key)
    ensure_collection(client)

    target_url = os.getenv(
        "TARGET_URL",
        "https://physical-ai-humanoid-robotics-ochre.vercel.app/"
    )

    urls = get_all_urls(target_url)[:limit]

    for url in urls:
        doc = extract_text_from_url(url)
        if not doc:
            continue

        chunks = chunk_text(doc.content)
        for c in chunks:
            c.document_url = url
            c.metadata["title"] = doc.title

        embeddings = embed_texts([c.content for c in chunks])

        client.upsert(
            collection_name="rag_embedding",
            points=[
                models.PointStruct(
                    id=c.id,
                    vector=v,
                    payload={
                        "content": c.content,
                        "source_url": c.document_url,
                        "title": c.metadata["title"]
                    }
                )
                for c, v in zip(chunks, embeddings)
            ]
        )

# ----------------- API -----------------
@app.get("/")
def root():
    return {"status": "Backend running"}

@app.post("/start_pipeline")
async def start_pipeline(limit: int = Query(10)):
    asyncio.create_task(run_pipeline(limit))
    return {"message": "Pipeline started"}

# ----------------- QUERY -----------------
class QueryRequest(BaseModel):
    question: str
    top_k: int = 3


@app.post("/query")
async def query_rag(req: QueryRequest):
    qdrant_url = os.getenv("QDRANT_URL")
    qdrant_key = os.getenv("QDRANT_API_KEY")

    if not qdrant_url:
        raise RuntimeError("QDRANT_URL missing")

    # 1️⃣ Cohere embeddings
    co = cohere.Client(os.getenv("COHERE_API_KEY"))
    query_vector = co.embed(
        texts=[req.question],
        model="embed-english-v3.0",
        input_type="search_query"
    ).embeddings[0]

    # 2️⃣ Headers (Qdrant Cloud needs api-key)
    headers = {
        "Content-Type": "application/json"
    }
    if qdrant_key:
        headers["api-key"] = qdrant_key

    # 3️⃣ ✅ Qdrant CORRECT payload
    payload = {
        "vector": query_vector,   # MUST be a plain list
        "limit": req.top_k,       # NOT "top"
        "with_payload": True
    }

    # 4️⃣ Call Qdrant
    async with httpx.AsyncClient(timeout=20.0) as client:
        r = await client.post(
            f"{qdrant_url}/collections/humanoid_ai_book/points/search",
            headers=headers,
            json=payload
        )

    # 5️⃣ Raise error clearly if Qdrant fails
    try:
        r.raise_for_status()
    except httpx.HTTPStatusError as e:
        print("Qdrant error response:", r.text)
        raise e

    results = r.json()["result"]

    # 6️⃣ Safe payload extraction
    return {
        "question": req.question,
        "answers": [
            {
                "content": hit["payload"].get("text", ""),   # 'content' -> 'text'
                "source_url": hit["payload"].get("url", "") # 'source_url' -> 'url'
            }
            for hit in results
            if hit.get("payload")
        ]
    }


# ----------------- LEGACY FRONTEND ROUTE -----------------
@app.post("/api/v1/queries")
async def query_rag_alias(req: QueryRequest):
    return await query_rag(req)
