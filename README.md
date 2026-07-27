# RAG Pipeline

Building a Retrieval-Augmented Generation (RAG) pipeline from scratch to understand how AI document chat actually works under the hood.

## What I'm Building

A system that lets you upload a PDF and chat with it using AI — similar to ChatPDF but built by hand, phase by phase.

## Pipeline Phases

- **Phase 1** — File upload to cloud storage (Cloudflare R2) with presigned URLs
- **Phase 2** — Text extraction from PDFs using pdf-parse
- **Phase 3** — Chunking extracted text into smaller pieces
- **Phase 4** — Converting chunks into vector embeddings (OpenAI)
- **Phase 5** — Storing vectors in PostgreSQL using pgvector
- **Phase 6** — Query and retrieval — answering questions from the document

## Stack

Next.js · PostgreSQL · Prisma · Cloudflare R2 · AWS · OpenAI · LangChain

Currently on: \**Phase 4 — *Embedding\*
