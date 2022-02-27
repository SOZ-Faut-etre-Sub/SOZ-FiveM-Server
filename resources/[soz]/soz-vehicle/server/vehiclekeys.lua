-- Variables
local QBCore = exports["qb-core"]:GetCoreObject()
local VehicleList = {}

-- Functions

local function CheckOwner(plate, identifier)
    local retval = false
    if VehicleList then
        local found = VehicleList[plate]
        if found then
            retval = found.owners[identifier] ~= nil and found.owners[identifier]
        end
    end

    return retval
end

-- Events

RegisterNetEvent("vehiclekeys:server:SetVehicleOwner", function(plate)
    if plate then
        local src = source
        local Player = QBCore.Functions.GetPlayer(src)
        if VehicleList then
            -- VehicleList exists so check for a plate
            local val = VehicleList[plate]
            if val then
                -- The plate exists
                VehicleList[plate].owners[Player.PlayerData.citizenid] = true
            else
                -- Plate not currently tracked so store a new one with one owner
                VehicleList[plate] = {owners = {}}
                VehicleList[plate].owners[Player.PlayerData.citizenid] = true
            end
        else
            -- Initialize new VehicleList
            VehicleList = {}
            VehicleList[plate] = {owners = {}}
            VehicleList[plate].owners[Player.PlayerData.citizenid] = true
        end
    else
        print("vehiclekeys:server:SetVehicleOwner - plate argument is nil")
    end
end)

RegisterNetEvent("vehiclekeys:server:GiveVehicleKeys", function(plate, target)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    if CheckOwner(plate, Player.PlayerData.citizenid) then
        if QBCore.Functions.GetPlayer(target) ~= nil then
            TriggerClientEvent("vehiclekeys:client:SetOwner", target, plate)
            TriggerClientEvent("hud:client:DrawNotification", src, "Vous avez donné les clés !")
            TriggerClientEvent("hud:client:DrawNotification", target, "Vous avez reçu les clés !")
        else
            TriggerClientEvent("hud:client:DrawNotification", source, "~r~La personne dort")
        end
    else
        TriggerClientEvent("hud:client:DrawNotification", source, "~r~Vous ne possédez pas ce véhicule")
    end
end)

-- callback

QBCore.Functions.CreateCallback("vehiclekeys:server:CheckOwnership", function(source, cb, plate)
    local check = VehicleList[plate]
    local retval = check ~= nil

    cb(retval)
end)

QBCore.Functions.CreateCallback("vehiclekeys:server:CheckHasKey", function(source, cb, plate)
    local Player = QBCore.Functions.GetPlayer(source)
    cb(CheckOwner(plate, Player.PlayerData.citizenid))
end)

--[[ a changer en prêter les clés
QBCore.Commands.Add("givecarkeys", "Give Car Keys", {{name = "id", help = "Player id"}}, true, function(source, args)
	local src = source
    local target = tonumber(args[1])
    TriggerClientEvent('vehiclekeys:client:GiveKeys', src, target)
end)
--]]
