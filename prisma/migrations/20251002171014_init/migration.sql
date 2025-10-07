-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `descript` LONGTEXT NULL,
    `sex` INTEGER NOT NULL DEFAULT 1,
    `address` VARCHAR(191) NULL,
    `job` VARCHAR(191) NULL,
    `birthdate` DATETIME(3) NULL,
    `portfolio` VARCHAR(191) NULL,
    `twitter` VARCHAR(191) NULL,
    `reddit` VARCHAR(191) NULL,
    `github` VARCHAR(191) NULL,
    `facebook` VARCHAR(191) NULL,
    `mail` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `linked` VARCHAR(191) NULL,
    `ava` VARCHAR(191) NULL,
    `pass` VARCHAR(191) NULL,
    `role` INTEGER NOT NULL,
    `date01` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `date02` DATETIME(3) NULL,
    `accountType` INTEGER NULL,

    UNIQUE INDEX `User_mail_key`(`mail`),
    UNIQUE INDEX `User_phone_key`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SharedPosts` (
    `userId` INTEGER NOT NULL,
    `postId` INTEGER NOT NULL,

    PRIMARY KEY (`userId`, `postId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Post` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `iduser` INTEGER NOT NULL,
    `img` LONGTEXT NULL,
    `content` LONGTEXT NULL,
    `stat01` INTEGER NULL,
    `stat02` INTEGER NULL,
    `lang` VARCHAR(191) NOT NULL DEFAULT 'vi',
    `date01` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `date02` DATETIME(3) NULL,
    `idSample` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PostSample` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `iduser` INTEGER NULL,
    `img` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `descript` VARCHAR(191) NULL,
    `typ01` JSON NULL,
    `typ02` JSON NULL,
    `typ03` JSON NULL,
    `date01` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `date02` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `iduser` INTEGER NOT NULL,
    `type` INTEGER NOT NULL,
    `amount` INTEGER NOT NULL,
    `data01` LONGTEXT NOT NULL,
    `status` INTEGER NOT NULL,
    `date01` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `date02` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SharedPosts` ADD CONSTRAINT `SharedPosts_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SharedPosts` ADD CONSTRAINT `SharedPosts_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_iduser_fkey` FOREIGN KEY (`iduser`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_idSample_fkey` FOREIGN KEY (`idSample`) REFERENCES `PostSample`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PostSample` ADD CONSTRAINT `PostSample_iduser_fkey` FOREIGN KEY (`iduser`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_iduser_fkey` FOREIGN KEY (`iduser`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
