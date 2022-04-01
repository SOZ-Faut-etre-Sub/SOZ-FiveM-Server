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
    TriggerClientEvent("soz_ems:client:revive", Player.PlayerData.source)
end)

RegisterServerEvent("lsmc:server:GiveBlood")
AddEventHandler("lsmc:server:GiveBlood", function(id)
    local Player = QBCore.Functions.GetPlayer(tonumber(id))
    TriggerClientEvent("lsmc:client:GiveBlood", Player.PlayerData.source)
end)
