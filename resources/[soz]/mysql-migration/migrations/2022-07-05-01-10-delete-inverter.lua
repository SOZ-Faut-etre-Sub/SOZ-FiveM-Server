table.insert(migrations, {
    name = "delete-default-inverter",
    queries = {
        [[
            DELETE FROM upw_facility WHERE identifier = 'inverter1';
        ]],
        [[
            DELETE FROM upw_facility WHERE identifier = 'inverter2';
        ]],
    },
});
