table.insert(migrations, {
    name = "update-pants-category",
    queries = {
        [[
            UPDATE shop_content SET category_id = 17 WHERE category_id = 6;
        ]],
    },
})

