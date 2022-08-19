table.insert(migrations, {
    name = "add-fields-table",
    queries = {
        [[
            create table field
            (
                id         int auto_increment primary key,
                identifier varchar(64) not null unique,
                owner      varchar(32) null,
                data       longtext    null,

                constraint data check (json_valid(`data`))
            );
        ]],
    },
})
