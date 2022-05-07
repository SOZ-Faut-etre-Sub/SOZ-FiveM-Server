QBCore = exports["qb-core"]:GetCoreObject()

RegisterNetEvent("soz-ems:server:setLit", function(id, isUsed)
    TriggerEvent("soz-ems:client:lit", -1, id, isUsed)
end)

RegisterServerEvent("lsmc:server:remove")
AddEventHandler("lsmc:server:remove", function(item)
    local Player = QBCore.Functions.GetPlayer(tonumber(source))
    exports["soz-inventory"]:RemoveItem(Player.PlayerData.source, item, 1, nil)
end)

RegisterServerEvent("lsmc:server:add")
AddEventHandler("lsmc:server:add", function(item)
    local Player = QBCore.Functions.GetPlayer(tonumber(source))
    exports["soz-inventory"]:AddItem(Player.PlayerData.source, item, 1, nil)
end)

RegisterServerEvent("lsmc:server:revive")
AddEventHandler("lsmc:server:revive", function(id)
    local Player = QBCore.Functions.GetPlayer(tonumber(id))
    TriggerClientEvent("soz_ems:client:Revive", Player.PlayerData.source)
    Player.Functions.SetMetaData("isdead", false)
end)

RegisterServerEvent("lsmc:server:GiveBlood")
AddEventHandler("lsmc:server:GiveBlood", function(id)
    local Player = QBCore.Functions.GetPlayer(tonumber(id))
    TriggerClientEvent("lsmc:client:GiveBlood", Player.PlayerData.source)
end)

-- Other
RegisterNetEvent("ems:server:buy", function(itemID)
    local player = QBCore.Functions.GetPlayer(source)

    if not Config.BossShop[player.PlayerData.job.id] then
        return
    end

    local item = Config.BossShop[player.PlayerData.job.id][itemID]

    if player.Functions.RemoveMoney("money", item.price) then
        exports["soz-inventory"]:AddItem(player.PlayerData.source, item.name, item.amount, item.metadata, nil, function(success, reason)
            if success then
                TriggerClientEvent("hud:client:DrawNotification", player.PlayerData.source,
                                   ("Vous venez d'acheter ~b~%s %s~s~ pour ~g~$%s"):format(item.amount, QBCore.Shared.Items[item.name].label, item.price))
            end
        end)
    else
        TriggerClientEvent("hud:client:DrawNotification", player.PlayerData.source, "Vous n'avez pas assez d'argent", "error")
    end
end)
