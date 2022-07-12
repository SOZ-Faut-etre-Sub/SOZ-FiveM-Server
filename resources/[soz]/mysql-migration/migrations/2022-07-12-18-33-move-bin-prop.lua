table.insert(migrations, {
    name = "move-bin-prop",
    queries = {
        [[
            UPDATE persistent_prop SET position = '{"x":193.33306884765626,"y":3041.50732421875,"z":42.87635040283203,"w":0.0}' WHERE id = 50;
        ]],
    },
});
