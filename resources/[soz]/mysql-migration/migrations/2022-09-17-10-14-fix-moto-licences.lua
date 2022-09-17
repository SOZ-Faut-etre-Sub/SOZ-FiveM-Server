table.insert(migrations, {
    name = "fix-moto-licences",
    queries = {
        [[
            UPDATE vehicles SET required_licence = 'motorcycle' WHERE category = 'Motorcycles';
        ]],
    },
})
