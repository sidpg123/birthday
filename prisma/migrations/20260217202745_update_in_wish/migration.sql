/*
  Warnings:

  - The `status` column on the `Wish` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "WishStatus" AS ENUM ('draft', 'published', 'expired');

-- AlterTable
ALTER TABLE "Wish" DROP COLUMN "status",
ADD COLUMN     "status" "WishStatus" NOT NULL DEFAULT 'draft';
