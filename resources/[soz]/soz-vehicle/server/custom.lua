local QBCore = exports["qb-core"]:GetCoreObject()

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

QBCore.Functions.CreateCallback("qb-vehicletuning:server:GetAttachedVehicle", function(source, cb)
    cb(Config.AttachedVehicle)
end)

RegisterNetEvent("qb-vehicletuning:server:SetAttachedVehicle", function(veh)
    if veh ~= false then
        Config.AttachedVehicle = veh
        TriggerClientEvent("qb-vehicletuning:client:SetAttachedVehicle", -1, veh)
    else
        Config.AttachedVehicle = nil
        TriggerClientEvent("qb-vehicletuning:client:SetAttachedVehicle", -1, false)
    end
end)

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

RegisterNetEvent("updateVehicle", function(myCar)
    local src = source
    if IsVehicleOwned(myCar.plate) then
        MySQL.Async.execute("UPDATE player_vehicles SET mods = ? WHERE plate = ?", {json.encode(myCar), myCar.plate})
    end
end)

RegisterNetEvent("qb-vehicletuning:server:Removeitem", function(item, amount)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    Player.Functions.RemoveItem(item, amount)
end)

RegisterNetEvent("soz-custom:server:buyupgrade", function(id, n, price)
    local src = source
    local pData = QBCore.Functions.GetPlayer(src)
    local money = pData.PlayerData.money["money"]
    if money > price then
        if n == 1 then
            TriggerClientEvent("hud:client:DrawNotification", src, "~g~Le turbo a été installé!")
            TriggerClientEvent("soz-custom:client:applymod", src, id, 1)
        else
            TriggerClientEvent("hud:client:DrawNotification", src, "~g~Le " .. n.name .. " a été installé!")
            TriggerClientEvent("soz-custom:client:applymod", src, id, n.id)
        end
        pData.Functions.RemoveMoney("money", price, "upgrade-bought-in-lscustom")

    else
        TriggerClientEvent("hud:client:DrawNotification", src, "~r~Pas assez d'argent")
    end
end)
