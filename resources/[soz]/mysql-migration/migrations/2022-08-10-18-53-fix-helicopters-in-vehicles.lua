table.insert(migrations, {
    name = "fix-helicopters-in-vehicles",
    queries = {
        [[
            UPDATE vehicles SET required_licence = 'heli' WHERE required_licence = 'air';
        ]],
    },
})
