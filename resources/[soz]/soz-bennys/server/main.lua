QBCore = exports["qb-core"]:GetCoreObject()

RegisterNetEvent("soz-bennys:server:Repair", function(veh, id)
    TriggerClientEvent("soz-bennys:client:Repair", id, veh)
end)

RegisterNetEvent("soz-bennys:server:Clean", function(veh, id)
    TriggerClientEvent("soz-bennys:client:Clean", id, veh)
end)

RegisterNetEvent("soz-bennys:server:EngineRepair", function(veh, id)
    TriggerClientEvent("soz-bennys:client:EngineRepair", id, veh)
end)

RegisterNetEvent("soz-bennys:server:BodyRepair", function(veh, id)
    TriggerClientEvent("soz-bennys:client:BodyRepair", id, veh)
end)

RegisterNetEvent("soz-bennys:server:FuelRepair", function(veh, id)
    TriggerClientEvent("soz-bennys:client:FuelRepair", id, veh)
end)

QBCore.Functions.CreateCallback("soz-bennys:server:IsVehicleOwned", function(source, cb, plate)
    local retval = false
    local result = MySQL.Sync.fetchScalar("SELECT 1 from player_vehicles WHERE plate = ?", {plate})
    if result then
        retval = true
    end
    cb(retval)
end)

QBCore.Functions.CreateCallback("soz-bennys:server:CloakroomTenues", function(source, cb, grade)
    local result = MySQL.Sync.fetchAll("SELECT name FROM job_grades WHERE id = ?", {grade})
    if result[1] then
        cb(result[1])
    end
end)

QBCore.Functions.CreateCallback("soz-bennys:server:IsMechanicAvailable", function(source, cb)
    local amount = 0
    for k, v in pairs(QBCore.Functions.GetPlayers()) do
        local Player = QBCore.Functions.GetPlayer(v)
        if Player ~= nil then
            if (Player.PlayerData.job.name == "bennys" and Player.PlayerData.job.onduty) then
                amount = amount + 1
            end
        end
    end
    cb(amount)
end)

function IsVehicleOwned(plate)
    local retval = false
    local result = MySQL.Sync.fetchScalar("SELECT plate FROM player_vehicles WHERE plate = ?", {plate})
    if result then
        retval = true
    end
    return retval
end

-- Other
RegisterNetEvent("soz-bennys:server:buy", function(itemID)
    local player = QBCore.Functions.GetPlayer(source)
    local item = Config.BossShop[itemID]

    if player.Functions.RemoveMoney("money", item.price) then
        TriggerEvent("monitor:server:event", "shop_buy", {player_source = player.PlayerData.source, shop_type = "job"},
                     {item_name = item.name, amount = item.price})

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

QBCore.Functions.CreateUseableItem("repairkit", function(source)
    TriggerClientEvent("soz-bennys:client:repairkit", source)
    exports["soz-inventory"]:RemoveItem(source, "repairkit", 1, nil)
end)

QBCore.Functions.CreateUseableItem("cleaningkit", function(source)
    TriggerClientEvent("soz-bennys:client:cleaningkit", source)
    exports["soz-inventory"]:RemoveItem(source, "cleaningkit", 1, nil)
end)
