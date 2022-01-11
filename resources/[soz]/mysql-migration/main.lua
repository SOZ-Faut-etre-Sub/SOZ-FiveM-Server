migrations = {};

CreateThread(
    function()
        -- Create if not exist migrations database
        MySQL.query.await(
            [[CREATE TABLE IF NOT EXISTS `migrations` (
            `name` varchar(255) NOT NULL PRIMARY KEY UNIQUE
        ) ENGINE=InnoDB;
    ]]
        )

        -- Loop on migrations
        for _, migration in ipairs(migrations) do
            -- Check migration exist
            local count = MySQL.scalar.await("SELECT COUNT(1) FROM migrations WHERE name = ?", {migration.name});
            local queries = {};

            -- Execute migration if needed
            if count == 0 then
                for _, migration_query in ipairs(migration.queries) do
                    table.insert(queries, {query = migration_query, values = {}});
                end

                table.insert(queries, {query = "INSERT INTO migrations VALUES(?)", values = {migration.name}});

                MySQL.transaction.await(queries);

                print("Executed migration " .. migration.name)
            end
        end
    end
)
