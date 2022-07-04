table.insert(migrations, {
    name = "update-kerosenestorage-bennys",
    queries = {
        [[
            UPDATE `fuel_storage` SET `position`= '{"x": -143.82, "y": -1282.58, "z": 46.9, "w": 1.69}' WHERE `station`= 'Bennys_heli';
        ]],
    },
});
