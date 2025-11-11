-- CreateEnum
CREATE TYPE "Subject" AS ENUM ('ENGLISH','IELTS','KAZAKH','RUSSIAN','MATH','PHYSICS','CHEMISTRY','BIOLOGY','HISTORY','IT','PROGRAMMING','NIS_PREP','ENT_PREP','OTHER');

-- AlterTable User add subjects
ALTER TABLE "User" ADD COLUMN "subjects" "Subject"[] DEFAULT ARRAY[]::"Subject"[];

-- CreateTable CourseGroup
CREATE TABLE "CourseGroup" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "subject" "Subject" NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "CourseGroup_pkey" PRIMARY KEY ("id")
);

-- AlterTable Course add columns
ALTER TABLE "Course"
  ADD COLUMN "subject" "Subject" NOT NULL DEFAULT 'OTHER',
  ADD COLUMN "groupId" TEXT;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "CourseGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Indexes
CREATE INDEX "Course_subject_idx" ON "Course"("subject");
CREATE INDEX "Course_groupId_idx" ON "Course"("groupId");
