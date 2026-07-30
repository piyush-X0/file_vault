-- CreateEnum
CREATE TYPE "EmbeddingStatus" AS ENUM ('PENDING', 'PROCESSING', 'EMBEDDED', 'FAILED');

-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "embeddingError" TEXT,
ADD COLUMN     "embeddingStatus" "EmbeddingStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "DocumentChunk" ADD COLUMN     "embedding" vector(1536);

-- CreateIndex
CREATE INDEX "Document_embeddingStatus_idx" ON "Document"("embeddingStatus");
