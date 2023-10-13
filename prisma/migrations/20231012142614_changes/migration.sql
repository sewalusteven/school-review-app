/*
  Warnings:

  - You are about to drop the column `academicLevelId` on the `Subject` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Subject" DROP CONSTRAINT "Subject_academicLevelId_fkey";

-- DropForeignKey
ALTER TABLE "Subject" DROP CONSTRAINT "Subject_curriculumId_fkey";

-- AlterTable
ALTER TABLE "AcademicLevel" ADD COLUMN     "curriculumId" INTEGER;

-- AlterTable
ALTER TABLE "Curriculum" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "District" ADD COLUMN     "region" TEXT;

-- AlterTable
ALTER TABLE "School" ALTER COLUMN "email" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Subject" DROP COLUMN "academicLevelId",
ALTER COLUMN "curriculumId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "_AcademicLevelToSubject" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AcademicLevelToSubject_AB_unique" ON "_AcademicLevelToSubject"("A", "B");

-- CreateIndex
CREATE INDEX "_AcademicLevelToSubject_B_index" ON "_AcademicLevelToSubject"("B");

-- AddForeignKey
ALTER TABLE "AcademicLevel" ADD CONSTRAINT "AcademicLevel_curriculumId_fkey" FOREIGN KEY ("curriculumId") REFERENCES "Curriculum"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_curriculumId_fkey" FOREIGN KEY ("curriculumId") REFERENCES "Curriculum"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AcademicLevelToSubject" ADD CONSTRAINT "_AcademicLevelToSubject_A_fkey" FOREIGN KEY ("A") REFERENCES "AcademicLevel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AcademicLevelToSubject" ADD CONSTRAINT "_AcademicLevelToSubject_B_fkey" FOREIGN KEY ("B") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;
