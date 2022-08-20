table.insert(migrations, {
    name = "update-policeb-to-policeb2",
    queries = {
        [[
            UPDATE concess_entreprise SET vehicle = 'policeb2' WHERE vehicle = 'policeb';
        ]],
        [[
            UPDATE player_vehicles SET vehicle = 'policeb2', hash = '-1921512137' WHERE vehicle = 'policeb';
        ]],
        [[
            UPDATE vehicles SET model = 'policeb2', hash = '-1921512137', required_licence = 'motorcycle' WHERE model = 'policeb';
        ]],
    },
})
