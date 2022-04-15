table.insert(migrations, {
    name = "update-concess-storage",
    queries = {
        [[
            UPDATE `concess_storage` SET `model`='baller' WHERE `model`= 'baller3';
        ]],
        [[
            UPDATE `concess_storage` SET `category`='Cycles' WHERE `model`= 'bmx';
        ]],
        [[
            UPDATE `concess_storage` SET `category`='Cycles' WHERE `model`= 'cruiser';
        ]],
        [[
            UPDATE `concess_storage` SET `category`='Cycles' WHERE `model`= 'fixter';
        ]],
        [[
            UPDATE `concess_storage` SET `category`='Cycles' WHERE `model`= 'scorcher';
        ]],
        [[
            UPDATE `concess_storage` SET `category`='Cycles' WHERE `model`= 'tribike3';
        ]],
        [[
            INSERT INTO concess_storage (model, stock, category) VALUES
                ('tribike', 6, 'Cycles'),
                ('tribike2', 6, 'Cycles')
            ;
        ]],
    },
});
