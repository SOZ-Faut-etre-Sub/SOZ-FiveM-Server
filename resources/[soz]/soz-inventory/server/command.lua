QBCore.Commands.Add("clearinv", "Clear Players Inventory (Admin Only)", {{name = "id", help = "Player ID"}}, false, function(source, args)
    local playerId = args[1] or source
    local Player = QBCore.Functions.GetPlayer(tonumber(playerId))
    if Player then
        Inventory.Clear(Player.PlayerData.source, false)
    else
        TriggerClientEvent("hud:client:DrawNotification", source, "Joueur non trouvé", "error")
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
                    metadata.serie = tostring(QBCore.Shared.RandomInt(2) .. QBCore.Shared.RandomStr(3) .. QBCore.Shared.RandomInt(1) ..
                                                  QBCore.Shared.RandomStr(2) .. QBCore.Shared.RandomInt(3) .. QBCore.Shared.RandomStr(4))
                end

                Inventory.AddItem(Player.PlayerData.source, itemData["name"], amount, metadata, false, function(success, reason)
                    if success then
                        TriggerClientEvent("hud:client:DrawNotification", source, string.format("Vous avez donné ~o~%s ~b~%s", amount, itemData["label"]))
                    else
                        TriggerClientEvent("hud:client:DrawNotification", source, "L'objet ne peut pas être donné: " .. reason, "error")
                    end
                end)
            else
                TriggerClientEvent("hud:client:DrawNotification", source, "L'objet n'existe pas !", "error")
            end
        end
    end
end, "admin")
