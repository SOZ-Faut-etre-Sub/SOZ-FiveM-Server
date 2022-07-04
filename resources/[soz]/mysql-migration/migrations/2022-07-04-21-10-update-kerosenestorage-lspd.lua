table.insert(migrations, {
    name = "update-kerosenestorage-lspd",
    queries = {
        [[
            UPDATE `fuel_storage` SET `position`= '{"x": 575.98, "y": 1.46, "z": 102.23, "w": 180.0}' WHERE `station`= 'LSPD_heli';
        ]],
    },
});
