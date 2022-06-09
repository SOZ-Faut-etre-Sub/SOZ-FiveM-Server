table.insert(migrations, {
    name = "create-housing-property-table",
    queries = {
        [[
            create table housing_property
            (
                id           int auto_increment primary key,
                identifier   varchar(32)                  not null,
                entry_zone   longtext collate utf8mb4_bin null,
                garage_zone  longtext collate utf8mb4_bin null,

                constraint housing_property_identifier_uindex unique (identifier),
                constraint entry_zone check (json_valid(`entry_zone`)),
                constraint garage_zone check (json_valid(`garage_zone`))
            );
        ]],
        [[
            INSERT INTO housing_property (identifier, entry_zone, garage_zone)
            SELECT COALESCE(building, identifier), entry_zone, garage_zone
            FROM player_house WHERE identifier IS NOT NULL
            ON DUPLICATE KEY UPDATE housing_property.entry_zone=COALESCE(player_house.entry_zone, housing_property.entry_zone),
                                    housing_property.garage_zone=COALESCE(player_house.garage_zone, housing_property.garage_zone);
        ]],
    },
})
