table.insert(migrations, {
    name = "add-player-purchases",
    queries = {
        [[
            CREATE TABLE IF NOT EXISTS `player_purchases` (
                `id` INTEGER NOT NULL AUTO_INCREMENT,
                `citizenid` VARCHAR(50) NOT NULL,
                `shop_type` VARCHAR(25) NOT NULL,
                `shop_id` VARCHAR(50) NULL,
                `item_id` VARCHAR(50) NOT NULL,
                `amount` INTEGER NOT NULL,
                `date` int(11) NOT NULL,

                INDEX `shop_id` (`shop_id`),
                PRIMARY KEY (`id`)
            );
        ]],
    },
})
