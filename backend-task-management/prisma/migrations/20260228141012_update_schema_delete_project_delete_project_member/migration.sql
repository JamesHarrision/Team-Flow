-- DropForeignKey
ALTER TABLE `project_members` DROP FOREIGN KEY `project_members_projectId_fkey`;

-- AddForeignKey
ALTER TABLE `project_members` ADD CONSTRAINT `project_members_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
