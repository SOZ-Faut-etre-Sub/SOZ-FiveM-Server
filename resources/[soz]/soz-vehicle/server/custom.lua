local QBCore = exports["qb-core"]:GetCoreObject()
local VehicleStatus = {}

RegisterNetEvent("qb-vehicletuning:server:SaveVehicleProps", function(vehicleProps)
    if IsVehicleOwned(vehicleProps.plate) then
        MySQL.Async.execute("UPDATE player_vehicles SET mods = ? WHERE plate = ?", {
            json.encode(vehicleProps),
            vehicleProps.plate,
        })
    end
end)

RegisterNetEvent("vehiclemod:server:setupVehicleStatus", function(plate, engineHealth, bodyHealth)
    engineHealth = engineHealth ~= nil and engineHealth or 1000.0
    bodyHealth = bodyHealth ~= nil and bodyHealth or 1000.0
    if VehicleStatus[plate] == nil then
        if IsVehicleOwned(plate) then
            local statusInfo = GetVehicleStatus(plate)
            if statusInfo == nil then
                statusInfo = {
                    ["engine"] = engineHealth,
                    ["body"] = bodyHealth,
                    ["radiator"] = Config.MaxStatusValues["radiator"],
                    ["axle"] = Config.MaxStatusValues["axle"],
                    ["brakes"] = Config.MaxStatusValues["brakes"],
                    ["clutch"] = Config.MaxStatusValues["clutch"],
                    ["fuel"] = Config.MaxStatusValues["fuel"],
                }
            end
            VehicleStatus[plate] = statusInfo
            TriggerClientEvent("vehiclemod:client:setVehicleStatus", -1, plate, statusInfo)
        else
            local statusInfo = {
                ["engine"] = engineHealth,
                ["body"] = bodyHealth,
                ["radiator"] = Config.MaxStatusValues["radiator"],
                ["axle"] = Config.MaxStatusValues["axle"],
                ["brakes"] = Config.MaxStatusValues["brakes"],
                ["clutch"] = Config.MaxStatusValues["clutch"],
                ["fuel"] = Config.MaxStatusValues["fuel"],
            }
            VehicleStatus[plate] = statusInfo
            TriggerClientEvent("vehiclemod:client:setVehicleStatus", -1, plate, statusInfo)
        end
    else
        TriggerClientEvent("vehiclemod:client:setVehicleStatus", -1, plate, VehicleStatus[plate])
    end
end)

QBCore.Functions.CreateCallback("qb-vehicletuning:server:IsVehicleOwned", function(source, cb, plate)
    local retval = false
    local result = MySQL.Sync.fetchScalar("SELECT 1 from player_vehicles WHERE plate = ?", {
        plate,
    })
    if result then
        retval = true
    end
    cb(retval)
end)

RegisterNetEvent("qb-vehicletuning:server:LoadStatus", function(veh, plate)
    VehicleStatus[plate] = veh
    TriggerClientEvent("vehiclemod:client:setVehicleStatus", -1, plate, veh)
end)

RegisterNetEvent("vehiclemod:server:updatePart", function(plate, part, level)
    if VehicleStatus[plate] ~= nil then
        if part == "engine" or part == "body" then
            VehicleStatus[plate][part] = level
            if VehicleStatus[plate][part] < 0 then
                VehicleStatus[plate][part] = 0
            elseif VehicleStatus[plate][part] > 1000 then
                VehicleStatus[plate][part] = 1000.0
            end
        else
            VehicleStatus[plate][part] = level
            if VehicleStatus[plate][part] < 0 then
                VehicleStatus[plate][part] = 0
            elseif VehicleStatus[plate][part] > 100 then
                VehicleStatus[plate][part] = 100
            end
        end
        TriggerClientEvent("vehiclemod:client:setVehicleStatus", -1, plate, VehicleStatus[plate])
    end
end)

RegisterNetEvent("qb-vehicletuning:server:SetPartLevel", function(plate, part, level)
    if VehicleStatus[plate] ~= nil then
        VehicleStatus[plate][part] = level
        TriggerClientEvent("vehiclemod:client:setVehicleStatus", -1, plate, VehicleStatus[plate])
    end
end)

RegisterNetEvent("vehiclemod:server:saveStatus", function(plate)
    if VehicleStatus[plate] ~= nil then
        MySQL.Async.execute("UPDATE player_vehicles SET status = ? WHERE plate = ?", {
            json.encode(VehicleStatus[plate]),
            plate,
        })
    end
end)

function IsVehicleOwned(plate)
    local result = MySQL.Sync.fetchScalar("SELECT 1 from player_vehicles WHERE plate = ?", {
        plate,
    })
    if result then
        return true
    else
        return false
    end
end

function GetVehicleStatus(plate)
    local retval = nil
    local result = MySQL.Sync.fetchAll("SELECT status FROM player_vehicles WHERE plate = ?", {
        plate,
    })
    if result[1] ~= nil then
        retval = result[1].status ~= nil and json.decode(result[1].status) or nil
    end
    return retval
end

QBCore.Commands.Add("setvehiclestatus", "Set Vehicle Status", {
    {
        name = "part",
        help = "Type The Part You Want To Edit",
    },
    {
        name = "amount",
        help = "The Percentage Fixed",
    },
}, true, function(source, args)
    local part = args[1]:lower()
    local level = tonumber(args[2])
    TriggerClientEvent("vehiclemod:client:setPartLevel", source, part, level)
end, "god")

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
        MySQL.Async.execute("UPDATE player_vehicles SET mods = ? WHERE plate = ?", {
            json.encode(myCar),
            myCar.plate,
        })
    end
end)

RegisterNetEvent("qb-vehicletuning:server:Removeitem", function(item, amount)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    Player.Functions.RemoveItem(item, amount)
end)

QBCore.Functions.CreateCallback("qb-vehicletuning:server:GetStatus", function(source, cb, plate)
    if VehicleStatus[plate] ~= nil and next(VehicleStatus[plate]) ~= nil then
        cb(VehicleStatus[plate])
    else
        cb(nil)
    end
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
