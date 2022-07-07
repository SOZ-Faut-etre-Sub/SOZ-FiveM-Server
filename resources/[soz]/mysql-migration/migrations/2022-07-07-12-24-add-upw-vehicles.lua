table.insert(migrations, {
    name = "add-upw-vehicles",
    queries = {
        [[
            INSERT INTO concess_entreprise (job, vehicle, price, liverytype) VALUES
                ('upw', 'brickade1', 35000, 1),
                ('upw', 'boxville', 24000, 1)
            ;
        ]],
        [[
            UPDATE concess_entreprise SET vehicle = 'sadler1' WHERE vehicle = 'sadler' AND job = 'pawl';
        ]],
        [[
            UPDATE concess_entreprise SET vehicle = 'hauler1' WHERE vehicle = 'hauler' AND job = 'pawl';
        ]],

    },
})
