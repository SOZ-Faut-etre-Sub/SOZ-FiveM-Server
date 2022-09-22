table.insert(migrations, {
    name = "add-prisma-migration",
    queries = {
        [[
            CREATE TABLE _prisma_migrations (
                id                  varchar(36)                               not null primary key,
                checksum            varchar(64)                               not null,
                finished_at         datetime(3)                               null,
                migration_name      varchar(255)                              not null,
                logs                text                                      null,
                rolled_back_at      datetime(3)                               null,
                started_at          datetime(3)  default current_timestamp(3) not null,
                applied_steps_count int unsigned default 0                    not null
            ) collate = utf8mb4_unicode_ci;
        ]],
        [[
            INSERT INTO _prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) VALUES ('1b129e92-9577-43e8-a342-60f55070eaf5', 'ac6530bd1d6058f911288e4e559280d48c96683ca030e2287459dd326cdb066c', '2022-09-22 08:20:09.925', '20220922081951_initial_migration', null, null, '2022-09-22 08:20:08.48', 1);
        ]],
    },
})
