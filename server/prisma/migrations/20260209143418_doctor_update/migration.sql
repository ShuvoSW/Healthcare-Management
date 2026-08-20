/*
  Warnings:

  - You are about to drop the column `expertise` on the `doctor` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "doctor" DROP COLUMN "expertise",
ADD COLUMN     "experience" INTEGER NOT NULL DEFAULT 0;
