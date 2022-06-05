--- Setup all containers
Container["player"] = InventoryContainer:new("player", {}, nil, function(id, items)
    local Player = QBCore.Functions.GetPlayer(tonumber(id))

    if Player then
        Player.Functions.SetInventory(items)
    else
        return false
    end
end)

Container["ammo"] = InventoryContainer:new("ammo", {"weapon_ammo"}, function(player, owner)
    return player.PlayerData.job.id == owner
end)

Container["armory"] = InventoryContainer:new("armory", {"weapon"}, function(player, owner)
    return player.PlayerData.job.id == owner
end)

Container["fridge"] = InventoryContainer:new("fridge", {"food", "drink"}, function(player, owner)
    return player.PlayerData.job.id == owner
end)

Container["trunk"] = InventoryContainer:new("trunk", {
    "weapon",
    "weapon_ammo",
    "item",
    "drug",
    "drink",
    "food",
    "oil_and_item",
})
Container["tanker"] = InventoryContainer:new("trunk", {"oil", "oil_and_item"})

Container["storage"] = InventoryContainer:new("storage", {"item", "drug", "oil_and_item"}, function(player, owner)
    return player.PlayerData.job.id == owner
end)
--- Todo: convert to storage type : storage
Container["storage_tank"] = InventoryContainer:new("storage_tank", {"oil", "oil_and_item"}, function(player, owner)
    return player.PlayerData.job.id == owner
end)
--- Todo: convert to storage type : storage
Container["seizure"] = InventoryContainer:new("seizure", {
    "weapon",
    "weapon_attachment",
    "weapon_ammo",
    "drug",
    "item_illegal",
}, function(player, owner)
    return player.PlayerData.job.id == owner and player.PlayerData.job.onduty
end)
--- Todo: convert to storage type : storage
Container["boss_storage"] = InventoryContainer:new("boss_storage", {
    "weapon",
    "weapon_ammo",
    "item",
    "drug",
    "oil_and_item",
}, function(player, owner)
    return SozJobCore.Functions.HasPermission(owner, player.PlayerData.job.id, player.PlayerData.job.grade, SozJobCore.JobPermission.SocietyPrivateStorage)
end)
--- Todo: convert to storage type : storage
Container["organ"] = InventoryContainer:new("organ", {"organ"}, function(player, owner)
    return player.PlayerData.job.id == owner
end)

Container["stash"] = InventoryContainer:new("stash", {"item"}, function(player, owner)
    if string.find(owner, player.PlayerData.citizenid) ~= nil then
        return true
    else
        return false
    end
end)

Container["bin"] = InventoryDatastore:new("bin", {"item"}, function()
    local inventory = {}
    local items = {
        ["plastic"] = math.random(0, 100) >= 80 and math.random(0, 2) or 0,
        ["metalscrap"] = math.random(0, 100) >= 80 and math.random(0, 1) or 0,
        ["aluminum"] = math.random(0, 100) >= 80 and math.random(0, 2) or 0,
        ["rubber"] = math.random(0, 100) >= 80 and math.random(0, 2) or 0,
        ["electronickit"] = math.random(0, 100) >= 80 and 1 or 0,
        ["rolex"] = math.random(0, 100) >= 90 and 1 or 0,
        ["diamond_ring"] = math.random(0, 100) >= 90 and 1 or 0,
        ["goldchain"] = math.random(0, 100) >= 90 and 1 or 0,
        ["10kgoldchain"] = math.random(0, 100) >= 90 and 1 or 0,
        ["goldbar"] = math.random(0, 100) >= 95 and 1 or 0,
        ["garbagebag"] = math.random(5, 20),
    }

    for item, amount in pairs(items) do
        if amount > 0 then
            inventory[#inventory + 1] = {slot = #inventory + 1, name = item, type = "item", amount = amount}
        end
    end

    return inventory
end)
