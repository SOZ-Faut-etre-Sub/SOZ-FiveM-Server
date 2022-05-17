table.insert(migrations, {
    name = "update-fuelstorage-bennys",
    queries = {
        [[
            UPDATE `fuel_storage` SET `position`= '{"x": -178.44, "y": -1323.02, "z": 30.3, "w": 270.0}' WHERE `station`= 'Bennys_car';
        ]],
    },
});
