/*
  Warnings:

  - Made the column `qualifications` on table `doctor` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "doctor" ALTER COLUMN "qualifications" SET NOT NULL;
