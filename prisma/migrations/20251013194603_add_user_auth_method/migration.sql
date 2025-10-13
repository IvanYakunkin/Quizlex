-- AlterTable
ALTER TABLE `users` ADD COLUMN `authMethod` VARCHAR(191) NOT NULL DEFAULT 'credentials',
    MODIFY `password` VARCHAR(191) NULL;
