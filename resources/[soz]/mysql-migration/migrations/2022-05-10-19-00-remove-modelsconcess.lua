table.insert(migrations, {
    name = "remove-modelsconcess",
    queries = {
        [[
            DELETE FROM `concess_storage` WHERE `model` = "akuma" OR `model` = "shotaro" OR `model` = "guardian" OR `model` = "mesa3" OR `model` = "camper" OR `model` = "gburrito" OR `model` = "journey" OR `model` = "rumpo3" OR `category` = "Sportsclassics";
        ]],
    },
});
