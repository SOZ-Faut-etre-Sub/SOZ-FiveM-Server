table.insert(migrations, {
    name = "add-invoice-table",
    queries = {
        [[
            CREATE TABLE IF NOT EXISTS `invoices`
            (
                `id` int(11) NOT NULL AUTO_INCREMENT,
                `citizenid` varchar(50) NOT NULL,
                `emitter` varchar(50) NOT NULL,
                `emitterName` varchar(50) NOT NULL,
                `label` varchar(200) NOT NULL,
                `amount` int(11) NOT NULL,
                `payed` bool NOT NULL DEFAULT false,
                `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(),
                `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP,
                PRIMARY KEY (`id`),
                KEY `citizenid` (`citizenid`),
                KEY `emitter` (`emitter`),
                KEY `payed` (`payed`)
            ) ENGINE=InnoDB AUTO_INCREMENT=1;
        ]],
    },
});
