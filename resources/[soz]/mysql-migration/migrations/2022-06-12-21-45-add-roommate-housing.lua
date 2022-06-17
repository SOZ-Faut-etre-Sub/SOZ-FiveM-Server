table.insert(migrations, {
    name = "add-roommate-housing",
    queries = {
        [[
            alter table housing_apartment add roommate varchar(50) null after owner;
        ]],
    },
})
