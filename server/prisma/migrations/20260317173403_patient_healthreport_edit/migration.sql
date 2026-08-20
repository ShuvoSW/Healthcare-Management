/*
  Warnings:

  - You are about to drop the column `dietaryPreferences` on the `patient_health_data` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "patient_health_data" DROP COLUMN "dietaryPreferences",
ADD COLUMN     "dietaryPreference" TEXT;
