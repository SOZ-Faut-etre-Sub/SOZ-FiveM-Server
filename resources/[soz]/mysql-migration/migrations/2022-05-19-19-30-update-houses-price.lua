table.insert(migrations, {
    name = "update-houses-price",
    queries = {
        [[
            UPDATE player_house SET price=price*2;
        ]],
    },
});
