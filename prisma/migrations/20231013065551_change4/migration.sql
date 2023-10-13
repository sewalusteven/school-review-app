/*
  Warnings:

  - You are about to drop the `_AcademicLevelToSubject` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_AcademicLevelToSubject" DROP CONSTRAINT "_AcademicLevelToSubject_A_fkey";

-- DropForeignKey
ALTER TABLE "_AcademicLevelToSubject" DROP CONSTRAINT "_AcademicLevelToSubject_B_fkey";

-- AlterTable
ALTER TABLE "Subject" ADD COLUMN     "academicLevelId" INTEGER;

-- DropTable
DROP TABLE "_AcademicLevelToSubject";

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_academicLevelId_fkey" FOREIGN KEY ("academicLevelId") REFERENCES "AcademicLevel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
