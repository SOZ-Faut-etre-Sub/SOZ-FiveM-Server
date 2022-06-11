table.insert(migrations, {
    name = "create-housing-apartment-table",
    queries = {
        [[
            create table housing_apartment
            (
                id           int auto_increment primary key,
                property_id  int                          not null,
                identifier   varchar(50)                  null,
                label        varchar(50)                  null,
                price        int                          null,
                owner        varchar(50)                  null,
                inside_coord longtext collate utf8mb4_bin null,
                exit_zone    longtext collate utf8mb4_bin null,
                fridge_zone  longtext collate utf8mb4_bin null,
                stash_zone   longtext collate utf8mb4_bin null,
                closet_zone  longtext collate utf8mb4_bin null,
                money_zone   longtext collate utf8mb4_bin null,

                constraint housing_apartment_housing_property_id_fk
                    foreign key (property_id) references housing_property (id)
                        on update cascade on delete cascade,
                constraint inside_coord check (json_valid(`inside_coord`)),
                constraint exit_zone check (json_valid(`exit_zone`)),
                constraint closet_zone check (json_valid(`closet_zone`)),
                constraint fridge_zone check (json_valid(`fridge_zone`)),
                constraint money_zone check (json_valid(`money_zone`)),
                constraint stash_zone check (json_valid(`stash_zone`))
            );
        ]],
        [[
            INSERT INTO housing_apartment (property_id, identifier, label, price, owner, inside_coord, exit_zone, fridge_zone, stash_zone, closet_zone, money_zone)
            SELECT (SELECT id from housing_property WHERE housing_property.identifier = player_house.identifier OR housing_property.identifier = player_house.building), identifier, identifier, price, owner, teleport, exit_zone, fridge_position, stash_position, closet_position, money_position
            FROM player_house WHERE identifier IS NOT NULL;
        ]],
    },
})
