table.insert(migrations, {
    name = "add-new-fuel-station-type",
    queries = {
        [[
            alter table `fuel_storage` add `type` varchar(20) default 'public' not null after `fuel`;
        ]],
        [[
            alter table `fuel_storage` add `owner` varchar(32) null after `type`;
        ]],
    },
});
