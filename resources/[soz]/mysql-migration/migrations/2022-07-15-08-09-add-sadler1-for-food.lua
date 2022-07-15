table.insert(migrations, {
    name = "add-sadler1-for-food",
    queries = {
        [[
            INSERT INTO concess_entreprise (job, vehicle, price, liverytype) VALUES
                ('food', 'sadler1', 20000, 2)
            ;
        ]],
    },
})
