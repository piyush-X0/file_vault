-- CreateEnum
CREATE TYPE "ExtractedStatus" AS ENUM ('PENDING', 'EXTRACTED', 'FAILED');

-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "extractedStatus" "ExtractedStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "extractedText" TEXT;
