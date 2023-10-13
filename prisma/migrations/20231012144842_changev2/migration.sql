/*
  Warnings:

  - Made the column `districtId` on table `School` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "School" DROP CONSTRAINT "School_districtId_fkey";

-- AlterTable
ALTER TABLE "School" ALTER COLUMN "districtId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "School" ADD CONSTRAINT "School_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
