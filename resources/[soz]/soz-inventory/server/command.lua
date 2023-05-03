QBCore.Commands.Add("clearinv", "Clear Players Inventory (Admin Only)", {{name = "id", help = "Player ID"}}, false, function(source, args)
    local playerId = args[1] or source
    local Player = QBCore.Functions.GetPlayer(tonumber(playerId))
    if Player then
        Inventory.Clear(Player.PlayerData.source, false)
    else
        TriggerClientEvent("soz-core:client:notification:draw", source, "Joueur non trouvé", "error")
    end
end, "admin")

QBCore.Commands.Add("giveitem", "Give An Item", {
    {name = "id", help = "Player ID"},
    {name = "item", help = "Name of the item"},
    {name = "amount", help = "Amount of items"},
}, true, function(source, args)
    local Player = QBCore.Functions.GetPlayer(tonumber(args[1]))
    local amount = tonumber(args[3])
    local itemData = QBCore.Shared.Items[tostring(args[2]):lower()]
    if Player ~= nil then
        if amount > 0 then
            if itemData ~= nil then
                -- check iteminfo
                local metadata = {}
                if itemData["type"] == "weapon" then
                    amount = 1
                end

                for id, meta in pairs(args) do
                    if id > 3 then
                        local key, value = string.match(meta, "(%S+)=(%S+)")
                        if key ~= nil and value ~= nil then
                            metadata[key] = value
                        end
                    end
                end

                Inventory.AddItem(Player.PlayerData.source, itemData["name"], amount, metadata, false, function(success, reason)
                    if success then
                        TriggerClientEvent("soz-core:client:notification:draw", source, string.format("Vous avez donné ~o~%s ~b~%s", amount, itemData["label"]))
                    else
                        TriggerClientEvent("soz-core:client:notification:draw", source, "L'objet ne peut pas être donné: " .. reason, "error")
                    end
                end)
            else
                TriggerClientEvent("soz-core:client:notification:draw", source, "L'objet n'existe pas !", "error")
            end
        end
    end
end, "admin")

QBCore.Commands.Add("setinv", "Force player inventory weight (Admin Only)", {
    {name = "id", help = "Player ID"},
    {name = "weight", help = "Weight"},
}, true, function(source, args)
    Inventory.SetMaxWeight(tonumber(args[1]), tonumber(args[2]))
end, "admin")
