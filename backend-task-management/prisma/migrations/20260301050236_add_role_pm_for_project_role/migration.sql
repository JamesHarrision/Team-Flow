-- AlterTable
ALTER TABLE `project_members` MODIFY `role` ENUM('OWNER', 'PM', 'MEMBER', 'VIEWER') NOT NULL DEFAULT 'MEMBER';
