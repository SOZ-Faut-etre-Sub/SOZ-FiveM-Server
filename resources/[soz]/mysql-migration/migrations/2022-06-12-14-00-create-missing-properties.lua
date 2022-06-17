table.insert(migrations, {
    name = "create-missing-properties",
    queries = {
        [[
            INSERT INTO housing_property (identifier, entry_zone, garage_zone) VALUES ('eclipse_towers', '{"y":313.55,"x":-774.35,"minZ":84.7,"heading":0,"z":85.7,"maxZ":87.2,"sy":11.60000000000001,"sx":1.4}', null);
        ]],
        [[
            INSERT INTO housing_property (identifier, entry_zone, garage_zone) VALUES ('tinsel_towers', '{"y":47.39,"x":-617.78,"minZ":42.59,"heading":0,"z":43.59,"maxZ":45.09,"sy":10,"sx":2}', null);
        ]],
        [[
            INSERT INTO housing_property (identifier, entry_zone, garage_zone) VALUES ('del_perro_heights', '{"y":-536.97,"x":-1447.98,"minZ":33.74,"heading":305,"z":34.74,"maxZ":36.24,"sy":0.4,"sx":2}', null);
        ]],
    },
})
