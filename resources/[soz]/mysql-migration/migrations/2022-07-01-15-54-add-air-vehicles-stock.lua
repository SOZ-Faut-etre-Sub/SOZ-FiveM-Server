table.insert(migrations, {
    name = "add-air-vehicles-stock",
    queries = {
        [[
            UPDATE concess_entreprise SET vehicle='frogger3', price=65000 WHERE vehicle = 'frogger';
        ]],
        [[
            UPDATE concess_entreprise SET price=65000 WHERE vehicle IN ('polmav', 'maverick2');
        ]],
        [[
            INSERT INTO concess_storage (model, stock, category) VALUES
                ('buzzard2', 6, 'Helicopters'),
                ('seasparrow', 6, 'Helicopters'),
                ('supervolito', 6, 'Helicopters'),
                ('supervolito2', 6, 'Helicopters'),
                ('swift', 6, 'Helicopters'),
                ('swift2', 6, 'Helicopters'),
                ('volatus', 6, 'Helicopters')
            ;
        ]],
    },
})
