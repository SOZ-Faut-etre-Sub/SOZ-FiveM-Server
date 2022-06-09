table.insert(migrations, {
    name = "add-upw-facility",
    queries = {
        [[
            CREATE TABLE IF NOT EXISTS`upw_facility` (
                `id` INT NOT NULL AUTO_INCREMENT,
                `type` VARCHAR(50) NOT NULL,
                `identifier` VARCHAR(50) NOT NULL,
                `data` LONGTEXT,
                PRIMARY KEY (`id`)
            );
        ]],
    },
});
