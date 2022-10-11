RegisterNetEvent("qb-vehicletuning:server:SaveVehicleProps", function(vehicleProps)
    if IsVehicleOwned(vehicleProps.plate) then
        MySQL.Async.execute("UPDATE player_vehicles SET mods = ? WHERE plate = ?", {
            json.encode(vehicleProps),
            vehicleProps.plate,
        })
    end
end)

QBCore.Functions.CreateCallback("qb-vehicletuning:server:IsVehicleOwned", function(source, cb, plate)
    local retval = false
    local result = MySQL.Sync.fetchScalar("SELECT 1 from player_vehicles WHERE plate = ?", {plate})
    if result then
        retval = true
    end
    cb(retval)
end)

function IsVehicleOwned(plate)
    local result = MySQL.Sync.fetchScalar("SELECT 1 from player_vehicles WHERE plate = ?", {plate})
    return result
end

RegisterNetEvent("qb-vehicletuning:server:CheckForItems", function(part)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    local RepairPart = Player.Functions.GetItemByName(Config.RepairCostAmount[part].item)

    if RepairPart ~= nil then
        if RepairPart.amount >= Config.RepairCostAmount[part].costs then
            TriggerClientEvent("qb-vehicletuning:client:RepaireeePart", src, part)
            Player.Functions.RemoveItem(Config.RepairCostAmount[part].item, Config.RepairCostAmount[part].costs)

            for i = 1, Config.RepairCostAmount[part].costs, 1 do
                TriggerClientEvent("inventory:client:ItemBox", src, QBCore.Shared.Items[Config.RepairCostAmount[part].item], "remove")
                Wait(500)
            end
        else
            TriggerClientEvent("QBCore:Notify", src,
                               "You Dont Have Enough " .. QBCore.Shared.Items[Config.RepairCostAmount[part].item]["label"] .. " (min. " ..
                                   Config.RepairCostAmount[part].costs .. "x)", "error")
        end
    else
        TriggerClientEvent("QBCore:Notify", src, "You Do Not Have " .. QBCore.Shared.Items[Config.RepairCostAmount[part].item]["label"] .. " bij je!", "error")
    end
end)

RegisterNetEvent("qb-vehicletuning:server:Removeitem", function(item, amount)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    Player.Functions.RemoveItem(item, amount)
end)

RegisterNetEvent("soz-custom:server:buyupgrade", function(id, n, price, plate)
    local src = source
    local pData = QBCore.Functions.GetPlayer(src)
    local money = pData.PlayerData.money["money"]
    if money > price then
        local mod_id = 1
        local mod_name = "turbo"

        if n ~= 1 then
            mod_id = n.id
            mod_name = n.name
        end

        TriggerClientEvent("hud:client:DrawNotification", src, "Le " .. mod_name .. " a été installé!")
        TriggerClientEvent("soz-custom:client:applymod", src, id, mod_id)

        pData.Functions.RemoveMoney("money", price, "upgrade-bought-in-lscustom")

        TriggerEvent("monitor:server:event", "vehicle_upgrade_buy", {
            player_source = pData.PlayerData.source,
            vehicle_plate = plate,
        }, {amount = price, category_id = id, mod_id = mod_id, mod_name = mod_name, vehicle_plate = plate})
    else
        TriggerClientEvent("hud:client:DrawNotification", src, "Pas assez d'argent", "error")
    end
end)
