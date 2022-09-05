table.insert(migrations, {
    name = "add-ffs-prop",
    queries = {
        [[
            INSERT INTO persistent_prop (model, position)
            VALUES
                ('1387880424', '{"x":719.65,"y":-963.63,"z":30.38,"w":-16.0}')
            ;
        ]],
    },
});
