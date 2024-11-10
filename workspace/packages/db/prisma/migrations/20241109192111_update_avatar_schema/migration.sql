/*
  Warnings:

  - You are about to drop the column `userId` on the `Avatar` table. All the data in the column will be lost.
  - Made the column `imageUrl` on table `Avatar` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `Avatar` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Avatar" DROP COLUMN "userId",
ALTER COLUMN "imageUrl" SET NOT NULL,
ALTER COLUMN "name" SET NOT NULL;
