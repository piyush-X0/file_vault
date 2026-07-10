-- AlterEnum
ALTER TYPE "ExtractedStatus" ADD VALUE 'PROCESSING';

-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "extractionError" TEXT;

-- CreateIndex
CREATE INDEX "Document_extractedStatus_idx" ON "Document"("extractedStatus");
