table.insert(migrations, {
    name = "add-persistent_props",
    queries = {
        [[
            create table persistent_prop
            (
                id       bigint auto_increment primary key,
                model    int                          not null,
                event    varchar(20)                  null,
                position longtext collate utf8mb4_bin not null,
                constraint position check (json_valid(`position`))
            );
        ]],
    },
});
