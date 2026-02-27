/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `refreshTokens` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `refreshTokens_token_key` ON `refreshtokens`;

-- AlterTable
ALTER TABLE `refreshtokens` MODIFY `token` TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `refreshTokens_token_key` ON `refreshTokens`(`token`(256));
