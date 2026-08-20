/*
  Warnings:

  - You are about to drop the column `qualification` on the `doctor` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "doctor" DROP COLUMN "qualification",
ADD COLUMN     "qualifications" TEXT;
