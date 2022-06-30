table.insert(migrations, {
    name = "insert-pawl-vehicles",
    queries = {
        [[
            INSERT INTO concess_entreprise (job, vehicle, price, liverytype)
            VALUES ('pawl', 'sadler', 5, 1);
        ]],
        [[
            INSERT INTO concess_entreprise (job, vehicle, price, liverytype)
            VALUES ('pawl', 'hauler', 5, 1);
        ]],
        [[
            INSERT INTO concess_entreprise (job, vehicle, price, liverytype)
            VALUES ('pawl', 'trailerlogs', 5, 1);
        ]],
    },
});
