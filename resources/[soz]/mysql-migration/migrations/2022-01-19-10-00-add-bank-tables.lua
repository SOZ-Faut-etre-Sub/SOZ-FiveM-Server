table.insert(migrations, {
    name = "add-bank-tables",
    queries = {
        [[
            CREATE TABLE IF NOT EXISTS `bank_accounts` (
              `id` bigint(255) NOT NULL AUTO_INCREMENT,
              `citizenid` varchar(50) DEFAULT NULL,
              `businessid` varchar(50) DEFAULT NULL,
              `gangid` varchar(50) DEFAULT NULL,
              `amount` bigint(255) NOT NULL DEFAULT 0,
              `account_type` enum('player','business','gang') NOT NULL DEFAULT 'player',
              PRIMARY KEY (`id`),
              UNIQUE KEY `citizenid` (`citizenid`),
              KEY `businessid` (`businessid`),
              KEY `gangid` (`gangid`)
            ) ENGINE=InnoDB AUTO_INCREMENT=1;
        ]],
        [[
            CREATE TABLE IF NOT EXISTS `bank_statements` (
              `id` bigint(255) NOT NULL AUTO_INCREMENT,
              `citizenid` varchar(50) DEFAULT NULL,
              `account` varchar(50) DEFAULT NULL,
              `businessid` varchar(50) DEFAULT NULL,
              `gangid` varchar(50) DEFAULT NULL,
              `deposited` int(11) DEFAULT NULL,
              `withdraw` int(11) DEFAULT NULL,
              `balance` int(11) DEFAULT NULL,
              `date` varchar(50) DEFAULT NULL,
              `reason` varchar(255) DEFAULT NULL,
              PRIMARY KEY (`id`),
              KEY `businessid` (`businessid`),
              KEY `gangid` (`gangid`)
            ) ENGINE=InnoDB AUTO_INCREMENT=1;
        ]],
    },
});
