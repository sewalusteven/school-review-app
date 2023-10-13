-- DropForeignKey
ALTER TABLE "School" DROP CONSTRAINT "School_curriculumId_fkey";

-- DropForeignKey
ALTER TABLE "School" DROP CONSTRAINT "School_districtId_fkey";

-- AlterTable
ALTER TABLE "School" ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "districtId" DROP NOT NULL,
ALTER COLUMN "about" DROP NOT NULL,
ALTER COLUMN "phoneNumber" DROP NOT NULL,
ALTER COLUMN "curriculumId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "School" ADD CONSTRAINT "School_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "School" ADD CONSTRAINT "School_curriculumId_fkey" FOREIGN KEY ("curriculumId") REFERENCES "Curriculum"("id") ON DELETE SET NULL ON UPDATE CASCADE;
