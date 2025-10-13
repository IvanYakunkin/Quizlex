/*
  Warnings:

  - You are about to drop the `moduels` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `cards` DROP FOREIGN KEY `cards_moduleId_fkey`;

-- DropForeignKey
ALTER TABLE `favorite_cards` DROP FOREIGN KEY `favorite_cards_moduleId_fkey`;

-- DropForeignKey
ALTER TABLE `moduels` DROP FOREIGN KEY `moduels_definitionLanguageId_fkey`;

-- DropForeignKey
ALTER TABLE `moduels` DROP FOREIGN KEY `moduels_termLanguageId_fkey`;

-- DropForeignKey
ALTER TABLE `moduels` DROP FOREIGN KEY `moduels_userId_fkey`;

-- DropIndex
DROP INDEX `cards_moduleId_fkey` ON `cards`;

-- DropIndex
DROP INDEX `favorite_cards_moduleId_fkey` ON `favorite_cards`;

-- DropTable
DROP TABLE `moduels`;

-- CreateTable
CREATE TABLE `modules` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `termLanguageId` INTEGER NOT NULL,
    `definitionLanguageId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `modules` ADD CONSTRAINT `modules_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `modules` ADD CONSTRAINT `modules_termLanguageId_fkey` FOREIGN KEY (`termLanguageId`) REFERENCES `languages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `modules` ADD CONSTRAINT `modules_definitionLanguageId_fkey` FOREIGN KEY (`definitionLanguageId`) REFERENCES `languages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cards` ADD CONSTRAINT `cards_moduleId_fkey` FOREIGN KEY (`moduleId`) REFERENCES `modules`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `favorite_cards` ADD CONSTRAINT `favorite_cards_moduleId_fkey` FOREIGN KEY (`moduleId`) REFERENCES `modules`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
