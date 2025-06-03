-- CreateTable
CREATE TABLE `Admin` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `Admin_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Machine` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `type` ENUM('ICE_CREAM_MACHINE', 'SUGARCANE_JUICE_MACHINE', 'COFFEE_TEA_MACHINE', 'PIZZA_OVEN', 'POPCORN_MACHINE', 'HOT_BEVERAGE_VENDING_MACHINE', 'SWEET_CORN_MACHINE', 'WAFFLE_MAKER', 'STAINLESS_STEEL_DEEP_FRYER') NOT NULL,
    `price` DOUBLE NOT NULL,
    `description` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MachineImage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(191) NOT NULL,
    `machineId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CommonSpecs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `machineId` INTEGER NOT NULL,
    `brand` VARCHAR(191) NULL,
    `material` VARCHAR(191) NULL,
    `bodyMaterial` VARCHAR(191) NULL,
    `powerSource` VARCHAR(191) NULL,
    `voltage` VARCHAR(191) NULL,
    `power` VARCHAR(191) NULL,
    `powerConsumptionKW` VARCHAR(191) NULL,
    `automationGrade` VARCHAR(191) NULL,
    `usage` VARCHAR(191) NULL,
    `warranty` VARCHAR(191) NULL,
    `dimensions` VARCHAR(191) NULL,
    `weight` VARCHAR(191) NULL,
    `countryOfOrigin` VARCHAR(191) NULL,
    `color` VARCHAR(191) NULL,
    `operationMode` VARCHAR(191) NULL,

    UNIQUE INDEX `CommonSpecs_machineId_key`(`machineId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `IceCreamSpecs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `machineId` INTEGER NOT NULL,
    `capacity` VARCHAR(191) NULL,
    `type` VARCHAR(191) NULL,

    UNIQUE INDEX `IceCreamSpecs_machineId_key`(`machineId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SugarcaneJuiceSpecs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `machineId` INTEGER NOT NULL,
    `capacity` VARCHAR(191) NULL,
    `motorType` VARCHAR(191) NULL,

    UNIQUE INDEX `SugarcaneJuiceSpecs_machineId_key`(`machineId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BeverageVendingSpecs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `machineId` INTEGER NOT NULL,
    `premixCanister` VARCHAR(191) NULL,
    `drinkOptions` VARCHAR(191) NULL,
    `hotWaterTankMaterial` VARCHAR(191) NULL,
    `dedicatedHotWater` VARCHAR(191) NULL,
    `autoFlush` VARCHAR(191) NULL,
    `dispensingRate` VARCHAR(191) NULL,
    `startUpTime` VARCHAR(191) NULL,
    `modelNameNumber` VARCHAR(191) NULL,
    `netWeight` VARCHAR(191) NULL,
    `grossWeight` VARCHAR(191) NULL,
    `packageDimensions` VARCHAR(191) NULL,

    UNIQUE INDEX `BeverageVendingSpecs_machineId_key`(`machineId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CoffeeMachineSpecs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `machineId` INTEGER NOT NULL,
    `capacityCups` VARCHAR(191) NULL,
    `type` VARCHAR(191) NULL,
    `startUpTime` VARCHAR(191) NULL,
    `hotTankMaterial` VARCHAR(191) NULL,

    UNIQUE INDEX `CoffeeMachineSpecs_machineId_key`(`machineId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WaffleMakerSpecs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `machineId` INTEGER NOT NULL,
    `type` VARCHAR(191) NULL,
    `size` VARCHAR(191) NULL,

    UNIQUE INDEX `WaffleMakerSpecs_machineId_key`(`machineId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PizzaOvenSpecs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `machineId` INTEGER NOT NULL,
    `ovenType` VARCHAR(191) NULL,
    `size` VARCHAR(191) NULL,
    `forBaking` VARCHAR(191) NULL,

    UNIQUE INDEX `PizzaOvenSpecs_machineId_key`(`machineId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PopcornMachineSpecs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `machineId` INTEGER NOT NULL,
    `snacksType` VARCHAR(191) NULL,
    `capacity` VARCHAR(191) NULL,

    UNIQUE INDEX `PopcornMachineSpecs_machineId_key`(`machineId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SweetCornMachineSpecs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `machineId` INTEGER NOT NULL,
    `capacity` VARCHAR(191) NULL,

    UNIQUE INDEX `SweetCornMachineSpecs_machineId_key`(`machineId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DeepFryerSpecs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `machineId` INTEGER NOT NULL,
    `capacity` VARCHAR(191) NULL,
    `surfaceTreatment` VARCHAR(191) NULL,
    `operation` VARCHAR(191) NULL,

    UNIQUE INDEX `DeepFryerSpecs_machineId_key`(`machineId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Contact` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `subject` TEXT NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Enquiry` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `productId` INTEGER NOT NULL,
    `quantity` INTEGER NULL,
    `unit` VARCHAR(191) NULL,
    `additionalInfo` TEXT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MachineImage` ADD CONSTRAINT `MachineImage_machineId_fkey` FOREIGN KEY (`machineId`) REFERENCES `Machine`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CommonSpecs` ADD CONSTRAINT `CommonSpecs_machineId_fkey` FOREIGN KEY (`machineId`) REFERENCES `Machine`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `IceCreamSpecs` ADD CONSTRAINT `IceCreamSpecs_machineId_fkey` FOREIGN KEY (`machineId`) REFERENCES `Machine`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SugarcaneJuiceSpecs` ADD CONSTRAINT `SugarcaneJuiceSpecs_machineId_fkey` FOREIGN KEY (`machineId`) REFERENCES `Machine`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BeverageVendingSpecs` ADD CONSTRAINT `BeverageVendingSpecs_machineId_fkey` FOREIGN KEY (`machineId`) REFERENCES `Machine`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CoffeeMachineSpecs` ADD CONSTRAINT `CoffeeMachineSpecs_machineId_fkey` FOREIGN KEY (`machineId`) REFERENCES `Machine`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WaffleMakerSpecs` ADD CONSTRAINT `WaffleMakerSpecs_machineId_fkey` FOREIGN KEY (`machineId`) REFERENCES `Machine`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PizzaOvenSpecs` ADD CONSTRAINT `PizzaOvenSpecs_machineId_fkey` FOREIGN KEY (`machineId`) REFERENCES `Machine`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PopcornMachineSpecs` ADD CONSTRAINT `PopcornMachineSpecs_machineId_fkey` FOREIGN KEY (`machineId`) REFERENCES `Machine`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SweetCornMachineSpecs` ADD CONSTRAINT `SweetCornMachineSpecs_machineId_fkey` FOREIGN KEY (`machineId`) REFERENCES `Machine`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DeepFryerSpecs` ADD CONSTRAINT `DeepFryerSpecs_machineId_fkey` FOREIGN KEY (`machineId`) REFERENCES `Machine`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Enquiry` ADD CONSTRAINT `Enquiry_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Machine`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
