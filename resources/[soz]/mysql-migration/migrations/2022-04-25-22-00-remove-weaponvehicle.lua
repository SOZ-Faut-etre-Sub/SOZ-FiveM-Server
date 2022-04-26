table.insert(migrations, {
    name = "remove-weaponvehicle",
    queries = {
        [[
            DELETE FROM `concess_storage` WHERE `model` = "blazer5" OR `model` = "Ruiner2";
        ]],
    },
});
