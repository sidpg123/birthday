/*
  Warnings:

  - You are about to drop the column `userId` on the `Wish` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Wish" DROP COLUMN "userId",
ADD COLUMN     "expiresAt" TIMESTAMP(3),
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'draft',
ALTER COLUMN "recipientName" DROP NOT NULL,
ALTER COLUMN "senderName" DROP NOT NULL,
ALTER COLUMN "message" DROP NOT NULL;
