-- Variables
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

RegisterNetEvent("vehiclekeys:server:RemoveVehicleKeys", function(plate)
    local player = QBCore.Functions.GetPlayer(source)
    local cid = player.PlayerData.citizenid
    if VehicleList[plate] and VehicleList[plate].owners and VehicleList[plate].owners[cid] then
        VehicleList[plate].owners[cid] = nil
    end
end)

RegisterNetEvent("vehiclekeys:server:GiveVehicleKeys", function(plate, target)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    if CheckOwner(plate, Player.PlayerData.citizenid) then
        if QBCore.Functions.GetPlayer(target) ~= nil then
            TriggerClientEvent("vehiclekeys:client:SetOwner", target, plate)
            TriggerClientEvent("hud:client:DrawNotification", src, "Vous avez donné les clés ~b~" .. plate)
            TriggerClientEvent("hud:client:DrawNotification", target, "Vous avez reçu les clés  ~b~" .. plate)
        end
    else
        TriggerClientEvent("hud:client:DrawNotification", src, "Vous ne possédez pas ce véhicule", "error")
    end
end)

RegisterNetEvent("QBCore:Server:PlayerUnload", function(src)
    for _, vehicleData in pairs(VehicleList) do
        if vehicleData.owners[src] then
            vehicleData.owners[src] = nil
        end
    end
end)

-- callback
QBCore.Functions.CreateCallback("vehiclekeys:server:CheckOwnership", function(source, cb, plate)
    local check = VehicleList[plate]
    local retval = check ~= nil

    cb(retval)
end)

QBCore.Functions.CreateCallback("vehiclekeys:server:GetPlayerKeys", function(source, cb)
    local Player = QBCore.Functions.GetPlayer(source)
    local keys = {}

    for plate, vehicleData in pairs(VehicleList) do
        if vehicleData.owners[Player.PlayerData.citizenid] then
            table.insert(keys, plate)
        end
    end

    cb(keys)
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
