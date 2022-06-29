table.insert(migrations, {
    name = "add-category-column",
    queries = {
        [[
            ALTER TABLE `player_vehicles` ADD `category` VARCHAR(50) DEFAULT 'car' NOT NULL AFTER job;
        ]]
    },
})
