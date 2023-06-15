CREATE TABLE `bank_transfers` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `amount` bigint(20) NOT NULL,
    `transmitterAccount` varchar(50) NOT NULL,
    `receiverAccount` varchar(50) NOT NULL,
    `createdAt` datetime NOT NULL DEFAULT current_timestamp(),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE=utf8mb4_unicode_ci;