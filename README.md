# file_vault

A RAG pipeline I built to understand how AI document chat works under the hood.
Every layer studied and implemented from scratch before moving to the next.

## Stack

TypeScript · Next.js · PostgreSQL · Prisma · pgvector

## Services & Models

- Cloudflare R2 — file storage
- Google GenAI — embeddings (`gemini-embedding-001`) + chat (`gemini-2.5-flash`)

## What I built

| Layer |                                       |
| ----- | ------------------------------------- |
| 1     | Presigned URL upload to Cloudflare R2 |
| 2     | PDF text extraction with pdf-parse    |
| 3     | Recursive text chunking with overlap  |
| 4     | Vector embeddings stored in pgvector  |
| 5     | Cosine similarity search → LLM answer |

## What I learned

- Why presigned URLs instead of proxying files through the server
- How chunking strategy affects retrieval quality
- Why pgvector over a dedicated vector DB for this scale
- How similarity search actually works before the LLM sees anything

---

Built it. Broke it. Fixed it. Understood it.
