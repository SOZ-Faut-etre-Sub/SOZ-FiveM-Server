table.insert(migrations, {
    name = "update-pawl-vehicle-price",
    queries = {
        [[
            UPDATE concess_entreprise SET price = 20000 WHERE job = 'pawl' AND vehicle = 'sadler';
        ]],
        [[
            UPDATE concess_entreprise SET price = 27000 WHERE job = 'pawl' AND vehicle = 'hauler';
        ]],
        [[
            UPDATE concess_entreprise SET price = 10000 WHERE job = 'pawl' AND vehicle = 'trailerlogs';
        ]],
    },
});
