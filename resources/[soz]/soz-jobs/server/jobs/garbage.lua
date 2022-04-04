local binProps = GetHashKey("prop_cs_bin_01_skinned")

--- Events
RegisterNetEvent("jobs:server:garbage:processBags", function()
    local Player = QBCore.Functions.GetPlayer(source)

    local playerGarbageBagAmount = exports["soz-inventory"]:GetItem(Player.PlayerData.source, "garbagebag", nil, true)

    if playerGarbageBagAmount < 1 then
        TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Il vous manque ~r~un sac poubelle", "error")

        return
    end

    local bagToProcess = math.random(1, playerGarbageBagAmount)

    exports["soz-inventory"]:RemoveItem(Player.PlayerData.source, "garbagebag", bagToProcess)
    TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Vous avez recyclé ~g~" .. bagToProcess .. " sac poubelle")
    TriggerEvent("banking:server:TransfertMoney", "farm_garbage", "garbage", bagToProcess * GarbageConfig.SellPrice)

    if exports["soz-inventory"]:GetItem(Player.PlayerData.source, "garbagebag", nil, true) >= 1 then
        TriggerClientEvent("jobs:client:garbage:processBags", Player.PlayerData.source)
    end
end)

--- Bin
CreateThread(function()
    for _, bin in pairs(GarbageConfig.BinLocation) do
        local prop = CreateObjectNoOffset(binProps, bin.x, bin.y, bin.z, true, true, false)
        SetEntityHeading(prop, bin.w + 180)
        FreezeEntityPosition(prop, true)
    end
end)
