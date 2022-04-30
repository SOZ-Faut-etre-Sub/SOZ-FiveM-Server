local itemToRefill = ((4 * 60) / 30) -- 4 minutes / progressbar time
local petroleumToLiter = 10

--- Events
RegisterNetEvent("jobs:server:fueler:refillTanker", function(tankerId)
    local Player = QBCore.Functions.GetPlayer(source)
    local tanker = NetworkGetEntityFromNetworkId(tankerId)
    local tankerPlate = GetVehicleNumberPlateText(tanker)

    exports["soz-inventory"]:AddItem("trunk_" .. tankerPlate, "petroleum", itemToRefill, nil, nil, function(success, _)
        if success then
            TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source,
                               ("Vous avez ~g~remplis~s~ %dL de pétrole"):format(itemToRefill * petroleumToLiter))
        else
            TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Votre remorque ~r~ne peut plus~s~ recevoir de pétrole.", "error")
        end
    end)
end)

RegisterNetEvent("jobs:server:fueler:refiningTanker", function(tankerId)
    local Player = QBCore.Functions.GetPlayer(source)
    local tanker = NetworkGetEntityFromNetworkId(tankerId)
    local tankerPlate = GetVehicleNumberPlateText(tanker)
    local tankerInv = "trunk_" .. tankerPlate

    if exports["soz-inventory"]:RemoveItem(tankerInv, "petroleum", itemToRefill) then
        local refinedSuccess = false

        exports["soz-inventory"]:AddItem(tankerInv, "petroleum_refined", 3 * itemToRefill, nil, nil, function(success, _)
            refinedSuccess = refinedSuccess or success
        end)
        exports["soz-inventory"]:AddItem(tankerInv, "petroleum_residue", itemToRefill, nil, nil, function(success, _)
            refinedSuccess = refinedSuccess or success
        end)

        if refinedSuccess then
            TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source,
                               ("Vous avez ~g~raffiné~s~ %dL de pétrole"):format(itemToRefill * petroleumToLiter))
        else
            TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Votre remorque ~r~ne peut plus~s~ recevoir de pétrole raffiné.",
                               "error")
        end
    end
end)

RegisterNetEvent("jobs:server:fueler:craftEssence", function()
    local Player = QBCore.Functions.GetPlayer(source)

    if exports["soz-inventory"]:RemoveItem(Player.PlayerData.source, "petroleum_refined", 1) then
        exports["soz-inventory"]:AddItem(Player.PlayerData.source, "essence", 1, nil, nil, function(success, _)
            if success then
                TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Vous avez ~g~transformé~s~ 10L en carburant")
            else
                TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Votre ne pouvez pas ~r~récupérer~s~ le carburant.", "error")
            end
        end)
    end
end)
RegisterNetEvent("jobs:server:fueler:craftEssenceJerryCan", function()
    local Player = QBCore.Functions.GetPlayer(source)

    if exports["soz-inventory"]:RemoveItem(Player.PlayerData.source, "essence", 3) then
        exports["soz-inventory"]:AddItem(Player.PlayerData.source, "essence_jerrycan", 1, nil, nil, function(success, _)
            if success then
                TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Vous avez ~g~transformé~s~ 30L en JerryCan")
            else
                TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Votre ne pouvez pas ~r~récupérer~s~ le JerryCan.", "error")
            end
        end)
    end
end)

--- Callback
QBCore.Functions.CreateCallback("jobs:server:fueler:canRefill", function(source, cb, tankerId)
    local tanker = NetworkGetEntityFromNetworkId(tankerId)
    local tankerPlate = GetVehicleNumberPlateText(tanker)

    cb(exports["soz-inventory"]:CanCarryItem("trunk_" .. tankerPlate, "petroleum", itemToRefill))
end)

QBCore.Functions.CreateCallback("jobs:server:fueler:canRefining", function(source, cb, tankerId)
    local tanker = NetworkGetEntityFromNetworkId(tankerId)
    local tankerPlate = GetVehicleNumberPlateText(tanker)

    local srcItem, srcItemAmount = "petroleum", 1
    local dstItem, dstItemAmount = "petroleum_refined", 3

    cb(exports["soz-inventory"]:CanSwapItem("trunk_" .. tankerPlate, srcItem, srcItemAmount, dstItem, dstItemAmount))
end)
