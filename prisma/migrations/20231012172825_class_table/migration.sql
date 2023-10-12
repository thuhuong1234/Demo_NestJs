-- CreateTable
CREATE TABLE `Class` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nameClass` VARCHAR(191) NOT NULL,
    `memberOfClass` INTEGER NOT NULL,

    UNIQUE INDEX `Class_nameClass_key`(`nameClass`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
