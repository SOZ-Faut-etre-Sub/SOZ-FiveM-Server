table.insert(migrations, {
    name = "add-investigation-table",
    queries = {
        [[
            create table IF NOT EXISTS `investigation`(
                `id` int auto_increment
                    primary key,
                `citizenid` varchar(255) not null,
                `service` varchar(255) not null,
                `title` varchar(128) not null,
                `content` longtext not null,
                `closed` boolean default false null,
                `granted` longtext null,
                `create_at` timestamp default CURRENT_TIMESTAMP null,
                `update_at` timestamp default CURRENT_TIMESTAMP null
              ) ENGINE = InnoDB AUTO_INCREMENT = 1;
        ]],
        [[
            create unique index `investigation_id_uindex`
                on `investigation` (`id`);
        ]],
    },
})
