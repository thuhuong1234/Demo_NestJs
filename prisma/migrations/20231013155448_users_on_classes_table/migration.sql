/*
  Warnings:

  - You are about to drop the `classuser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `classuser` DROP FOREIGN KEY `ClassUser_classId_fkey`;

-- DropForeignKey
ALTER TABLE `classuser` DROP FOREIGN KEY `ClassUser_userId_fkey`;

-- DropTable
DROP TABLE `classuser`;
