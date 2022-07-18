table.insert(migrations, {
    name = "add-boats-stock",
    queries = {
        [[
            INSERT INTO concess_storage (model, stock, category) VALUES
                ('dinghy', 5, 'Boats'),
                ('jetmax', 5, 'Boats'),
                ('marquis', 5, 'Boats'),
                ('seashark', 10, 'Boats'),
                ('speeder', 5, 'Boats'),
                ('speeder2', 5, 'Boats'),
                ('squalo', 5, 'Boats'),
                ('suntrap', 5, 'Boats'),
                ('toro', 5, 'Boats'),
                ('toro2', 5, 'Boats'),
                ('tropic', 5, 'Boats'),
                ('tropic2', 5, 'Boats'),
                ('longfin', 3, 'Boats')
            ;
        ]],
    },
})
