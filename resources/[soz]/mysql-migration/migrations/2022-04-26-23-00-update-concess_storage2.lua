table.insert(migrations, {
    name = "update-concess-storage2",
    queries = {
        [[
            UPDATE `concess_storage` SET `model`='akuma' WHERE `model`= 'AKUMA';
        ]],
    },
});
