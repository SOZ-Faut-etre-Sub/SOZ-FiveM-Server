table.insert(migrations, {
    name = "update-ffs-liverytype",
    queries = {
        [[
            UPDATE concess_entreprise SET liverytype = 1 WHERE vehicle = 'rumpo4';
        ]],
        [[
            UPDATE vehicles SET name = 'Diabolus Custom' WHERE model = 'diablous2';
        ]],
        [[
            INSERT INTO vehicles (model, name, price, category, dealership_id, required_licence, size) VALUES ('rumpo4', 'Rumpo', 24000, 'Vans', NULL, 'car', 1);
        ]],
    },
})
