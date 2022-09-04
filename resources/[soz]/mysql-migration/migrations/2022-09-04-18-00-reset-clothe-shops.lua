table.insert(migrations, {
    name = "reset-clothe-shops",
    queries = {
        [[
           UPDATE shop_content SET stock = 0;
        ]],
    },
})
