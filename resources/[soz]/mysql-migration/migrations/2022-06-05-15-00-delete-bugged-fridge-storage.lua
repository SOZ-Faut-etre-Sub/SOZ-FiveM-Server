table.insert(migrations, {
    name = "delete-bugged-fridge-storage",
    queries = {
        [[
            DELETE FROM storages WHERE name = 'fridge_bcso_fridge' AND type = 'fridge' AND owner = 'bcso_fridge' AND inventory is NULL;
        ]],
        [[
            DELETE FROM storages WHERE name = 'fridge_bennys_fridge' AND type = 'fridge' AND owner = 'bennys_fridge' AND inventory is NULL;
        ]],
        [[
            DELETE FROM storages WHERE name = 'fridge_food_fridge' AND type = 'fridge' AND owner = 'food_fridge' AND inventory is NULL;
        ]],
        [[
            DELETE FROM storages WHERE name = 'fridge_garbage_fridge' AND type = 'fridge' AND owner = 'garbage_fridge' AND inventory is NULL;
        ]],
        [[
            DELETE FROM storages WHERE name = 'fridge_lsmc_fridge' AND type = 'fridge' AND owner = 'lsmc_fridge' AND inventory is NULL;
        ]],
        [[
            DELETE FROM storages WHERE name = 'fridge_lspd_fridge' AND type = 'fridge' AND owner = 'lspd_fridge' AND inventory is NULL;
        ]],
        [[
            DELETE FROM storages WHERE name = 'fridge_news_fridge' AND type = 'fridge' AND owner = 'news_fridge' AND inventory is NULL;
        ]],
        [[
            DELETE FROM storages WHERE name = 'fridge_oil_fridge' AND type = 'fridge' AND owner = 'oil_fridge' AND inventory is NULL;
        ]],
        [[
            DELETE FROM storages WHERE name = 'fridge_stonk_fridge' AND type = 'fridge' AND owner = 'stonk_fridge' AND inventory is NULL;
        ]],
        [[
            DELETE FROM storages WHERE name = 'fridge_taxi_fridge' AND type = 'fridge' AND owner = 'taxi_fridge' AND inventory is NULL;
        ]],
    },
})
