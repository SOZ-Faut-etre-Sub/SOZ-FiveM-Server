table.insert(migrations, {
    name = "fix-chinos-data",
    queries = {
        [[
            UPDATE shop_content
            SET data = '{"components":{"4":{"Drawable":141,"Palette":0,"Texture":18}},"label":"#CLO_FXM_L_3_18","modelHash":1885233650}'
            WHERE label = '#CLO_FXM_L_3_18';
        ]],
        [[
            UPDATE shop_content
            SET data = '{"components":{"4":{"Drawable":141,"Palette":0,"Texture":19}},"label":"#CLO_FXM_L_3_19","modelHash":1885233650}'
            WHERE label = '#CLO_FXM_L_3_19';
        ]],
        [[
            UPDATE shop_content
            SET data = '{"components":{"4":{"Drawable":141,"Palette":0,"Texture":20}},"label":"#CLO_FXM_L_3_20","modelHash":1885233650}'
            WHERE label = '#CLO_FXM_L_3_20';
        ]],
        [[
            INSERT INTO shop_content (shop_id, category_id, label, price, data) VALUES
            (2, 7, '#CLO_FXM_L_3_21', 50, '{"components":{"4":{"Drawable":141,"Palette":0,"Texture":21}},"label":"#CLO_FXM_L_3_21","modelHash":1885233650}'),
            (3, 7, '#CLO_FXM_L_3_21', 50, '{"components":{"4":{"Drawable":141,"Palette":0,"Texture":21}},"label":"#CLO_FXM_L_3_21","modelHash":1885233650}'),
            (2, 7, '#CLO_FXM_L_3_22', 50, '{"components":{"4":{"Drawable":141,"Palette":0,"Texture":22}},"label":"#CLO_FXM_L_3_22","modelHash":1885233650}'),
            (3, 7, '#CLO_FXM_L_3_22', 50, '{"components":{"4":{"Drawable":141,"Palette":0,"Texture":22}},"label":"#CLO_FXM_L_3_22","modelHash":1885233650}'),
            (2, 7, '#CLO_FXM_L_3_23', 50, '{"components":{"4":{"Drawable":141,"Palette":0,"Texture":23}},"label":"#CLO_FXM_L_3_23","modelHash":1885233650}'),
            (3, 7, '#CLO_FXM_L_3_23', 50, '{"components":{"4":{"Drawable":141,"Palette":0,"Texture":23}},"label":"#CLO_FXM_L_3_23","modelHash":1885233650}'),
            (2, 7, '#CLO_FXM_L_3_24', 50, '{"components":{"4":{"Drawable":141,"Palette":0,"Texture":24}},"label":"#CLO_FXM_L_3_24","modelHash":1885233650}'),
            (3, 7, '#CLO_FXM_L_3_24', 50, '{"components":{"4":{"Drawable":141,"Palette":0,"Texture":24}},"label":"#CLO_FXM_L_3_24","modelHash":1885233650}'),
            (2, 7, '#CLO_FXM_L_3_25', 50, '{"components":{"4":{"Drawable":141,"Palette":0,"Texture":25}},"label":"#CLO_FXM_L_3_25","modelHash":1885233650}'),
            (3, 7, '#CLO_FXM_L_3_25', 50, '{"components":{"4":{"Drawable":141,"Palette":0,"Texture":25}},"label":"#CLO_FXM_L_3_25","modelHash":1885233650}'),
            (1, 17, '#CLO_FXF_L_3_21', 50, '{"components":{"4":{"Drawable":148,"Palette":0,"Texture":21}},"label":"#CLO_FXF_L_3_21","modelHash":-1667301416}'),
            (1, 17, '#CLO_FXF_L_3_22', 50, '{"components":{"4":{"Drawable":148,"Palette":0,"Texture":22}},"label":"#CLO_FXF_L_3_22","modelHash":-1667301416}'),
            (1, 17, '#CLO_FXF_L_3_23', 50, '{"components":{"4":{"Drawable":148,"Palette":0,"Texture":23}},"label":"#CLO_FXF_L_3_23","modelHash":-1667301416}'),
            (1, 17, '#CLO_FXF_L_3_24', 50, '{"components":{"4":{"Drawable":148,"Palette":0,"Texture":24}},"label":"#CLO_FXF_L_3_24","modelHash":-1667301416}'),
            (1, 17, '#CLO_FXF_L_3_25', 50, '{"components":{"4":{"Drawable":148,"Palette":0,"Texture":25}},"label":"#CLO_FXF_L_3_25","modelHash":-1667301416}');
        ]]
    }
})
