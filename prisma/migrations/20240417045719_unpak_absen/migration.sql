-- CreateTable
CREATE TABLE `Absen` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nidn` VARCHAR(20) NOT NULL,
    `tanggal` DATETIME(3) NOT NULL,
    `absen_masuk` DATETIME(3) NOT NULL,
    `absen_keluar` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(20) NOT NULL,
    `password` TEXT NOT NULL,
    `nama` VARCHAR(200) NOT NULL,
    `level` ENUM('sdm', 'warek', 'atasan', 'dosen', 'pegawai') NOT NULL,
    `NIDN` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cuti` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nidn` VARCHAR(20) NOT NULL,
    `tanggal_pengajuan` DATETIME(3) NOT NULL,
    `lama_cuti` INTEGER NOT NULL,
    `tujuan` VARCHAR(191) NOT NULL,
    `dokumen` TEXT NULL,
    `status` ENUM('menunggu', 'terima', 'tolak') NOT NULL,
    `catatan` TEXT NULL,
    `jenisCutiId` INTEGER NOT NULL,

    UNIQUE INDEX `Cuti_jenisCutiId_key`(`jenisCutiId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Izin` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nidn` VARCHAR(20) NOT NULL,
    `tanggal_pengajuan` DATETIME(3) NOT NULL,
    `tujuan` VARCHAR(191) NOT NULL,
    `dokumen` TEXT NULL,
    `status` ENUM('menunggu', 'terima', 'tolak') NOT NULL,
    `catatan` TEXT NULL,
    `jenisIzinId` INTEGER NOT NULL,

    UNIQUE INDEX `Izin_jenisIzinId_key`(`jenisIzinId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `JenisCuti` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(255) NOT NULL,
    `min` INTEGER NOT NULL,
    `max` INTEGER NOT NULL,
    `kondisi` TEXT NOT NULL,
    `dokumen` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `JenisIzin` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Cuti` ADD CONSTRAINT `Cuti_jenisCutiId_fkey` FOREIGN KEY (`jenisCutiId`) REFERENCES `JenisCuti`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Izin` ADD CONSTRAINT `Izin_jenisIzinId_fkey` FOREIGN KEY (`jenisIzinId`) REFERENCES `JenisIzin`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
