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
                'Alice Douce',
                'license:a163f8a42c3bc81604d59a8e6ed9355ddcf21346',
                'god'
            );
        ]],
        [[
            INSERT INTO permissions (
                name,
                license,
                permission
            )
            value (
                'Ichiban Nagami',
                'license:9d9ff1287560c2f504c456b8996a7e17260373a0',
                'god'
            );
        ]],
    },
});
