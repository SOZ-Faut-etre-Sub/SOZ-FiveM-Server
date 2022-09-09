table.insert(migrations, {
    name = "remove-zevent-tshirt",
    queries = {
        [[
            DELETE FROM shop_content WHERE label IN ('#CLO_HP_D_38', '#CLO_H3F_U_10_19');
        ]],
    },
})
