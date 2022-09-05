table.insert(migrations, {
    name = "add-sac-stock",
    queries = {
        [[
             UPDATE shop_content SET stock = 1000000000 WHERE category_id = 15;
        ]],
    },
})

