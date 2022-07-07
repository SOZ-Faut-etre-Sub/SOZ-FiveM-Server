table.insert(migrations, {
    name = "remove-all-upw-terminal",
    queries = {
        [[
            DELETE FROM upw_facility WHERE type = 'terminal';
        ]],
    },
});
