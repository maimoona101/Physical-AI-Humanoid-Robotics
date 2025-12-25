# Data Model: Embedding Pipeline

## Core Entities

### Document
Represents a single page of content extracted from a URL

**Fields:**
- `id` (str): Unique identifier (UUID or URL hash)
- `url` (str): Original source URL
- `title` (str): Page title
- `content` (str): Clean text content
- `created_at` (datetime): Timestamp of processing
- `word_count` (int): Number of words in content
- `source_domain` (str): Domain of the source URL

### Chunk
Represents a portion of a document after chunking

**Fields:**
- `id` (str): Unique identifier
- `document_id` (str): Reference to parent document
- `content` (str): Chunked text content
- `chunk_index` (int): Position of chunk in original document
- `token_count` (int): Estimated token count for the chunk

### Embedding
Represents vector representation of content

**Fields:**
- `vector` (list[float]): The embedding vector
- `chunk_id` (str): Reference to the chunk that was embedded
- `model_name` (str): Name of the model used for embedding
- `dimensionality` (int): Size of the embedding vector

### Qdrant Point
Structure for storing in Qdrant vector database

**Fields:**
- `id` (str): Unique point ID
- `vector` (list[float]): Embedding vector
- `payload` (dict): Metadata including:
  - `url` (str): Source URL
  - `title` (str): Page title
  - `content` (str): Text content
  - `chunk_index` (int): Position in document
  - `created_at` (str): ISO timestamp

## Relationships

```
Document (1) -> (Many) Chunk
Chunk (1) -> (1) Embedding
Embedding -> Stored as Qdrant Point
```

## Validation Rules

### Document Validation
- URL must be a valid HTTP(S) address
- Content must not be empty after cleaning
- Title must not exceed 500 characters

### Chunk Validation
- Content must be between 100-2000 characters (configurable)
- No chunk should be empty
- Chunk indices must be sequential for each document

### Embedding Validation
- Vector must have consistent dimensionality
- Model name must match the configured embedding model
- Chunk reference must exist

## State Transitions

### Document States
1. `discovered` - URL found but not yet processed
2. `fetching` - Content being retrieved
3. `cleaning` - Content being cleaned and parsed
4. `processed` - Ready for chunking
5. `completed` - Successfully embedded and stored
6. `failed` - Error occurred during processing

## Indexing Strategy

### Qdrant Collection Configuration
- Collection name: `rag_embedding`
- Vector size: Determined by embedding model (typically 1024 for Cohere)
- Distance metric: Cosine similarity
- Payload schema: Flexible to accommodate metadata