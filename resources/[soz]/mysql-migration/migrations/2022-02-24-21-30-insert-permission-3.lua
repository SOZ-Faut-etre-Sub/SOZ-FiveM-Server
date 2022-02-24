table.insert(migrations, {
    name = "insert-permission-2",
    queries = {
        [[
            INSERT INTO permissions (
                name,
                license,
                permission
            )
            value (
                'Lanahrone',
                'license:01aeffc7095a8b4557b9ae7a0a974d9255eb8481',
                'god'
            );
        ]],
    },
});
