/*
  Warnings:

  - Made the column `recipientName` on table `Wish` required. This step will fail if there are existing NULL values in that column.
  - Made the column `senderName` on table `Wish` required. This step will fail if there are existing NULL values in that column.
  - Made the column `message` on table `Wish` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Wish" ALTER COLUMN "recipientName" SET NOT NULL,
ALTER COLUMN "senderName" SET NOT NULL,
ALTER COLUMN "message" SET NOT NULL;
