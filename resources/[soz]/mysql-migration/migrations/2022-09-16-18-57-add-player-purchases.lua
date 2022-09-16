table.insert({
    name = "add-player-purchases",
    queries = {
        [[
            CREATE TABLE `player_purchases` (
                `id` INTEGER NOT NULL AUTO_INCREMENT,
                `citizenid` VARCHAR(50) NOT NULL,
                `shop_type` VARCHAR(25) NOT NULL,
                `shop_id` VARCHAR(50) NULL,
                `item_id` VARCHAR(50) NOT NULL,
                `amount` INTEGER NOT NULL,
                `date` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

                INDEX `shop_id` (`shop_id`)
                PRIMARY KEY (`id`)
            ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
        ]]
    }
})
