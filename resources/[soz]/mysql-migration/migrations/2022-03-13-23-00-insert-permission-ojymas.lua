table.insert(migrations, {
    name = "insert-permission-ojymas",
    queries = {
        [[
            INSERT INTO permissions (
                name,
                license,
                permission
            )
            value (
                'ojymas',
                'license:cc93293fb00042c44ef6d6e6bed59bb37e3b5a8e',
                'god'
            );
        ]],
    },
});
