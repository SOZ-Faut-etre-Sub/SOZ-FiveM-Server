table.insert(migrations, {
    name = "update-pants-category",
    queries = {
        [[
            UPDATE shop_content SET category_id = 17 WHERE category_id = 6;
        ]],
        [[
            insert into category (id, name, parent_id) values

                    (29, 'Tanga', 19),
                    (30, 'Dentelle', 19),
                    (31, 'Bikini', 19),
                    (32, 'Boxer', 19);
        ]],
        [[
            insert into shop_categories (shop_id, category_id) values
                (1, 29),
                (1, 30),
                (2, 31),
                (2, 32),
                (3, 32);
        ]],
        [[
            UPDATE shop_content SET category_id = 29 WHERE label like '#CLO_VALF_L_0_%';
        ]],
        [[
            UPDATE shop_content SET category_id = 30 WHERE label like '#CLO_VALF_L_1_%';
        ]],
        [[
            UPDATE shop_content SET category_id = 31, shop_id = 2 WHERE label like '#CLO_VALF_L_1_%';
        ]],
        [[
            UPDATE shop_content SET category_id = 30 WHERE label like '#CLO_V2F_L_0_%';
        ]],
        [[
            UPDATE shop_content SET category_id = 30 WHERE label like '#CLO_V2F_L_1_%';
        ]],
        [[
            UPDATE shop_content SET category_id = 32 WHERE label like '#CLO_V2M_L_1_%';
        ]],
    },
})

