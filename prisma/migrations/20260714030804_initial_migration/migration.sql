-- CreateEnum
CREATE TYPE "UploadStatus" AS ENUM ('PENDING', 'UPLOADED', 'FAILED');

-- CreateEnum
CREATE TYPE "ExtractedStatus" AS ENUM ('PENDING', 'PROCESSING', 'EXTRACTED', 'FAILED');

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "r2key" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "mimetype" TEXT NOT NULL,
    "uploadStatus" "UploadStatus" NOT NULL DEFAULT 'PENDING',
    "extractedStatus" "ExtractedStatus" NOT NULL DEFAULT 'PENDING',
    "extractedText" TEXT,
    "extractionError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Document_r2key_key" ON "Document"("r2key");

-- CreateIndex
CREATE INDEX "Document_extractedStatus_idx" ON "Document"("extractedStatus");
