table.insert(migrations, {
    name = "add-impounded-counter",
    queries = {
        [[
            ALTER TABLE `player_vehicles` ADD COLUMN `life_counter` INT(1) NOT NULL DEFAULT 3 AFTER state;
        ]],
        [[
            ALTER TABLE `player_vehicles` DROP COLUMN `depotprice`;
        ]],
    },
})
