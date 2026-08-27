/*
  Warnings:

  - A unique constraint covering the columns `[chunkKey]` on the table `document_embeddings` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "document_embeddings_chunkKey_key" ON "document_embeddings"("chunkKey");
