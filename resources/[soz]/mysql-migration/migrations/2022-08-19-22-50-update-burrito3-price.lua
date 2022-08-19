table.insert(migrations, {
    name = "update-burrito3-price",
    queries = {
        [[
            UPDATE vehicles SET price = 23760 WHERE model = 'burrito3';
        ]],
    },
})
