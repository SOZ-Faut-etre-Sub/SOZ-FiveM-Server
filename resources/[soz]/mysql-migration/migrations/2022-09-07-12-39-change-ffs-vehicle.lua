table.insert(migrations, {
    name = "change-ffs-vehicle",
    queries = {
        [[
            UPDATE `concess_entreprise` SET vehicle = 'rumpo4', liverytype = 0 WHERE vehicle = 'boxville' AND job = 'ffs';
        ]],
    },
});
