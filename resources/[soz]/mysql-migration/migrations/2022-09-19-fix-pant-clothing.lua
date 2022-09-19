table.insert(migrations, {
    name = "fix-pant-clothing",
    queries = [[
        UPDATE shop_content SET data = '{"components":{"4":{"Drawable":24,"Palette":0,"Texture":0}},"label":"#CLO_HILF_L_1_0","modelHash":1885233650}' WHERE id = 641;
        UPDATE shop_content SET data = '{"components":{"4":{"Drawable":24,"Palette":0,"Texture":1}},"label":"#CLO_HILF_L_1_1","modelHash":1885233650}' WHERE id = 642;
        UPDATE shop_content SET data = '{"components":{"4":{"Drawable":24,"Palette":0,"Texture":2}},"label":"#CLO_HILF_L_1_2","modelHash":1885233650}' WHERE id = 643;
        UPDATE shop_content SET data = '{"components":{"4":{"Drawable":24,"Palette":0,"Texture":3}},"label":"#CLO_HILF_L_1_3","modelHash":1885233650}' WHERE id = 644;
        UPDATE shop_content SET data = '{"components":{"4":{"Drawable":24,"Palette":0,"Texture":4}},"label":"#CLO_HILF_L_1_4","modelHash":1885233650}' WHERE id = 645;
        UPDATE shop_content SET data = '{"components":{"4":{"Drawable":24,"Palette":0,"Texture":5}},"label":"#CLO_HILF_L_1_5","modelHash":1885233650}' WHERE id = 646;
        UPDATE shop_content SET data = '{"components":{"4":{"Drawable":24,"Palette":0,"Texture":6}},"label":"#CLO_HILF_L_1_6","modelHash":1885233650}' WHERE id = 647;
    ]],
})
