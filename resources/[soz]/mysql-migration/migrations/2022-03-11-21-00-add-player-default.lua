table.insert(migrations, {
    name = "add-player-default",
    queries = {
        [[
            ALTER TABLE `players` ADD COLUMN `is_default` INT(1) NOT NULL DEFAULT 0;
        ]],
        [[
            UPDATE `players` SET is_default = 1;
        ]],
    },
});
