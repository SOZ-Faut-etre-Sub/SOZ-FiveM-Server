table.insert(migrations, {
    name = "add-update-job-dealership-category",
    queries = {
        [[
            ALTER TABLE `concess_entreprise` ADD `category` VARCHAR(50) DEFAULT 'car' NOT NULL AFTER `price`;
        ]],
        [[
            UPDATE concess_entreprise SET vehicle = 'frogger3', category = 'air', liverytype = 1, price = 65000 WHERE vehicle = 'frogger';
        ]],
        [[
            INSERT INTO concess_entreprise (job, vehicle, price, category, liverytype) VALUES
                ('bennys', 'cargobob2', 65000, 'air', 0)
            ;
        ]],
        [[
            UPDATE concess_entreprise SET price = 65000, category = 'air' WHERE vehicle IN ('polmav', 'maverick2');
        ]],
    },
})
