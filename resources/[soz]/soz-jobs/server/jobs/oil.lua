local Fields = {}
local itemToRefill = 11 -- give 11 item for 24 second
local tankerLocked = {}
local MAX_PEOPLE_BY_TANKER = 2

-- Create Fields
for name, data in pairs(FuelerConfig.Fields) do
    Fields[name] = Field:new(name, data.item, data.prodRange.max, data.prodRange, data.refillDelay, itemToRefill, false)
    Fields[name]:StartRefillLoop(data.refillDelay)
end

QBCore.Functions.CreateCallback("soz-jobs:server:fueler:getFieldHealth", function(source, cb, fieldName)
    local field = Fields[fieldName]
    if field ~= nil then
        cb(field:GetHealthState())
    end
    cb(nil)
end)

--- Events
QBCore.Functions.CreateCallback("jobs:server:fueler:refillTanker", function(source, cb, tankerId, fieldName)
    local Player = QBCore.Functions.GetPlayer(source)
    if Player == nil then
        cb({0, 0})
        return
    end

    local field = Fields[fieldName]
    if field == nil then
        TriggerClientEvent("hud:client:DrawNotification", source, "Il y a eu une erreur: invalid_field", "error")
        cb({0, 0})
        return
    end

    local tanker = NetworkGetEntityFromNetworkId(tankerId)
    local tankerPlate = GetVehicleNumberPlateText(tanker)

    local quantity, item, newHealth = field:Harvest()

    exports["soz-inventory"]:AddItem("trunk_" .. tankerPlate, item, quantity, nil, nil, function(success, _)
        if success then
            TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, ("Vous avez ~g~remplis~s~ %dL de pétrole"):format(quantity))

            TriggerEvent("monitor:server:event", "job_mtp_fill_oil_tanker", {player_source = Player.PlayerData.source},
                         {
                quantity = tonumber(quantity),
                position = GetEntityCoords(GetPlayerPed(Player.PlayerData.source)),
            })
        else
            TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Votre remorque ~r~ne peut plus~s~ recevoir de pétrole.", "error")
            cb({0, newHealth})
            return
        end
    end)

    cb({quantity, newHealth})
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
            TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, ("Vous avez ~g~raffiné~s~ %dL de pétrole"):format(itemToRefill))

            TriggerEvent("monitor:server:event", "job_mtp_refining_oil", {player_source = Player.PlayerData.source},
                         {
                quantity = tonumber(itemToRefill),
                position = GetEntityCoords(GetPlayerPed(Player.PlayerData.source)),
            })
        else
            TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Votre remorque ~r~ne peut plus~s~ recevoir de pétrole raffiné.",
                               "error")
        end
    end
end)

RegisterNetEvent("jobs:server:fueler:resetTanker", function(tankerId)
    local tanker = NetworkGetEntityFromNetworkId(tankerId)
    local tankerPlate = GetVehicleNumberPlateText(tanker)
    local tankerInv = "trunk_" .. tankerPlate

    if GetVehicleType(tanker) == "trailer" then
        exports["soz-inventory"]:Clear(tankerInv, false)
    end
end)

RegisterNetEvent("jobs:server:fueler:craftEssence", function()
    local Player = QBCore.Functions.GetPlayer(source)
    local essenceItemAmount = exports["soz-inventory"]:GetItem(Player.PlayerData.source, "petroleum_refined", nil, true)

    if exports["soz-inventory"]:CanSwapItem(Player.PlayerData.source, "petroleum_refined", essenceItemAmount, "essence", essenceItemAmount) then
        if exports["soz-inventory"]:RemoveItem(Player.PlayerData.source, "petroleum_refined", essenceItemAmount) then
            exports["soz-inventory"]:AddItem(Player.PlayerData.source, "essence", essenceItemAmount, nil, nil, function(success, _)
                if success then
                    TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source,
                                       ("Vous avez ~g~transformé~s~ %dL en carburant"):format(essenceItemAmount))

                    TriggerEvent("monitor:server:event", "job_mtp_create_gasoline", {
                        player_source = Player.PlayerData.source,
                    }, {
                        quantity = essenceItemAmount,
                        position = GetEntityCoords(GetPlayerPed(Player.PlayerData.source)),
                    })
                else
                    TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Votre ne pouvez pas ~r~récupérer~s~ le carburant.", "error")
                end
            end)
        end
    else
        TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Votre ne pouvez pas ~r~transformer~s~ autant d'essence.", "error")
    end
end)

RegisterNetEvent("jobs:server:fueler:craftEssenceJerryCan", function()
    local Player = QBCore.Functions.GetPlayer(source)
    local essenceItemAmount = math.floor(exports["soz-inventory"]:GetItem(Player.PlayerData.source, "essence", nil, true) / 3)

    if exports["soz-inventory"]:CanSwapItem(Player.PlayerData.source, "essence", essenceItemAmount * 3, "essence_jerrycan", essenceItemAmount) then
        if exports["soz-inventory"]:RemoveItem(Player.PlayerData.source, "essence", essenceItemAmount * 3) then
            exports["soz-inventory"]:AddItem(Player.PlayerData.source, "essence_jerrycan", essenceItemAmount, nil, nil, function(success, _)
                if success then
                    TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source,
                                       ("Vous avez ~g~transformé~s~ %dL en JerryCan"):format(essenceItemAmount))
                    TriggerEvent("monitor:server:event", "job_mtp_create_jerrycan", {
                        player_source = Player.PlayerData.source,
                    }, {
                        quantity = essenceItemAmount,
                        position = GetEntityCoords(GetPlayerPed(Player.PlayerData.source)),
                    })
                else
                    TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Votre ne pouvez pas ~r~récupérer~s~ le JerryCan.", "error")
                end
            end)
        end
    else
        TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Votre ne pouvez pas ~r~transformer~s~ autant d'essence.", "error")
    end
end)

RegisterNetEvent("jobs:server:fueler:craftKerosene", function()
    local Player = QBCore.Functions.GetPlayer(source)
    local keroseneItemAmount = math.floor(exports["soz-inventory"]:GetItem(Player.PlayerData.source, "petroleum_refined", nil, true) / 4)
    local petrolItemAmount = math.ceil(keroseneItemAmount * 4)

    if petrolItemAmount <= 1 then
        TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Vous n'avez pas assez de pétrole pour transformer en kérosène.", "error")
        return
    end

    if not exports["soz-inventory"]:CanSwapItem(Player.PlayerData.source, "petroleum_refined", petrolItemAmount, "kerosene", keroseneItemAmount) then
        TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Votre ne pouvez pas ~r~transformer~s~ autant d'essence.", "error")
        return
    end

    if exports["soz-inventory"]:RemoveItem(Player.PlayerData.source, "petroleum_refined", petrolItemAmount) then
        exports["soz-inventory"]:AddItem(Player.PlayerData.source, "kerosene", keroseneItemAmount, nil, nil, function(success, _)
            if success then
                TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source,
                                   ("Vous avez ~g~transformé~s~ %dL en kérosène"):format(keroseneItemAmount))

                TriggerEvent("monitor:server:event", "job_mtp_create_gasoline", {
                    player_source = Player.PlayerData.source,
                }, {quantity = keroseneItemAmount, position = GetEntityCoords(GetPlayerPed(Player.PlayerData.source))})
            else
                TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Votre ne pouvez pas ~r~récupérer~s~ le kérosène.", "error")
            end
        end)
    end
end)

RegisterNetEvent("jobs:server:fueler:craftKeroseneJerryCan", function()
    local Player = QBCore.Functions.GetPlayer(source)
    local jerrycanItemAmount = math.floor(exports["soz-inventory"]:GetItem(Player.PlayerData.source, "kerosene", nil, true) / 3)
    local keroseneItemAmount = jerrycanItemAmount * 3

    if not exports["soz-inventory"]:CanSwapItem(Player.PlayerData.source, "kerosene", keroseneItemAmount, "kerosene_jerrycan", jerrycanItemAmount) then
        TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Votre ne pouvez pas ~r~transformer~s~ autant de kérosène.", "error")
        return
    end

    if exports["soz-inventory"]:RemoveItem(Player.PlayerData.source, "kerosene", keroseneItemAmount) then
        exports["soz-inventory"]:AddItem(Player.PlayerData.source, "kerosene_jerrycan", jerrycanItemAmount, nil, nil, function(success, _)
            if success then
                TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source,
                                   ("Vous avez ~g~transformé~s~ %dL en JerryCan"):format(jerrycanItemAmount))
                TriggerEvent("monitor:server:event", "job_mtp_create_jerrycan", {
                    player_source = Player.PlayerData.source,
                }, {quantity = jerrycanItemAmount, position = GetEntityCoords(GetPlayerPed(Player.PlayerData.source))})
            else
                TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Votre ne pouvez pas ~r~récupérer~s~ le JerryCan.", "error")
            end
        end)
    end
end)

QBCore.Functions.CreateCallback("jobs:server:fueler:resellTanker", function(source, cb, tankerId)
    local Player = QBCore.Functions.GetPlayer(source)
    local tanker = NetworkGetEntityFromNetworkId(tankerId)
    local tankerPlate = GetVehicleNumberPlateText(tanker)
    local tankerInv = "trunk_" .. tankerPlate

    local essenceItemAmount = exports["soz-inventory"]:GetItem("trunk_" .. tankerPlate, "essence", nil, true)
    local keroseneItemAmount = exports["soz-inventory"]:GetItem("trunk_" .. tankerPlate, "kerosene", nil, true)

    if essenceItemAmount >= 10 then
        if exports["soz-inventory"]:RemoveItem(tankerInv, "essence", 10) then
            TriggerEvent("banking:server:TransferMoney", "farm_mtp", "safe_oil", 10 * FuelerConfig.SellPrice)
            TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Vous avez ~g~revendu~s~ 100L d'essence")
            TriggerEvent("monitor:server:event", "job_mtp_sell_oil", {player_source = Player.PlayerData.source},
                         {quantity = 10, position = GetEntityCoords(GetPlayerPed(Player.PlayerData.source))})

            cb(true)
            return
        end
    end

    if keroseneItemAmount >= 10 then
        if exports["soz-inventory"]:RemoveItem(tankerInv, "kerosene", 10) then
            TriggerEvent("banking:server:TransferMoney", "farm_mtp", "safe_oil", 10 * FuelerConfig.SellPrice)
            TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Vous avez ~g~revendu~s~ 100L de kérosène")
            TriggerEvent("monitor:server:event", "job_mtp_sell_oil", {player_source = Player.PlayerData.source},
                         {quantity = 10, position = GetEntityCoords(GetPlayerPed(Player.PlayerData.source))})

            cb(true)
            return
        end
    end

    cb(false)
end)

QBCore.Functions.CreateCallback("jobs:server:fueler:ensureInventory", function(source, cb, tankerId, model, class)
    local tanker = NetworkGetEntityFromNetworkId(tankerId)
    local tankerPlate = GetVehicleNumberPlateText(tanker)
    local inventory = exports["soz-inventory"]:GetOrCreateInventory("tanker", tankerPlate, {
        model = model,
        class = class,
    })

    if inventory ~= nil then
        cb(true)
    else
        cb(false)
    end
end)

--- Callback
QBCore.Functions.CreateCallback("jobs:server:fueler:canRefill", function(source, cb, tankerId)
    local tanker = NetworkGetEntityFromNetworkId(tankerId)
    local tankerPlate = GetVehicleNumberPlateText(tanker)

    cb(exports["soz-inventory"]:CanCarryItem("trunk_" .. tankerPlate, "petroleum", itemToRefill))
end)

QBCore.Functions.CreateCallback("jobs:server:fueler:lockTanker", function(source, cb, tankerId)
    local currentSources = tankerLocked[tankerId]

    if currentSources and #currentSources >= MAX_PEOPLE_BY_TANKER then
        for index, tankerSource in pairs(currentSources) do
            -- Check player still connected, otherwise it is unlocked
            local Player = QBCore.Functions.GetPlayer(tankerSource)

            if not Player then
                currentSources[index] = nil
            end
        end
    end

    if currentSources and #currentSources >= MAX_PEOPLE_BY_TANKER then
        cb(false)
    end

    if currentSources then
        table.insert(currentSources, source)
    else
        currentSources = {source}
    end

    tankerLocked[tankerId] = currentSources
    cb(true)
end)

QBCore.Functions.CreateCallback("jobs:server:fueler:unlockTanker", function(source, cb, tankerId)
    cb(true)

    local currentSources = tankerLocked[tankerId]

    if currentSources then
        for index, tankerSource in pairs(currentSources) do
            if source == tankerSource then
                currentSources[index] = nil
            end
        end
    end

    if not currentSources or #currentSources == 0 then
        tankerLocked[tankerId] = nil
    end
end)

QBCore.Functions.CreateCallback("jobs:server:fueler:canRefining", function(source, cb, tankerId)
    local tanker = NetworkGetEntityFromNetworkId(tankerId)
    local tankerPlate = GetVehicleNumberPlateText(tanker)

    local srcItem, srcItemAmount = "petroleum", 1
    local dstItem, dstItemAmount = "petroleum_refined", 3

    cb(exports["soz-inventory"]:CanSwapItem("trunk_" .. tankerPlate, srcItem, srcItemAmount, dstItem, dstItemAmount))
end)

QBCore.Functions.CreateCallback("jobs:server:fueler:canStationRefill", function(source, cb, tankerId, amount)
    local tanker = NetworkGetEntityFromNetworkId(tankerId)
    local tankerPlate = GetVehicleNumberPlateText(tanker)
    local itemToUse = math.ceil(amount / 10)

    cb(exports["soz-inventory"]:GetItem("trunk_" .. tankerPlate, "essence", nil, true) >= itemToUse)
end)

QBCore.Functions.CreateCallback("jobs:server:fueler:canKeroseneStationRefill", function(source, cb, amount)
    local Player = QBCore.Functions.GetPlayer(source)
    local itemToUse = math.ceil(amount / 10)

    cb(exports["soz-inventory"]:GetItem(Player.PlayerData.source, "kerosene", nil, true) >= itemToUse)
end)

QBCore.Functions.CreateCallback("jobs:server:fueler:canResell", function(source, cb, tankerId)
    local tanker = NetworkGetEntityFromNetworkId(tankerId)
    local tankerPlate = GetVehicleNumberPlateText(tanker)

    local essenceItemAmount = exports["soz-inventory"]:GetItem("trunk_" .. tankerPlate, "essence", nil, true)
    local keroseneItemAmount = exports["soz-inventory"]:GetItem("trunk_" .. tankerPlate, "kerosene", nil, true)

    cb(essenceItemAmount >= 10 or keroseneItemAmount >= 10)
end)

QBCore.Functions.CreateCallback("jobs:server:fueler:GetFuelStationPrices", function(source, cb)
    local stations = MySQL.execute.await("SELECT DISTINCT fuel, price FROM fuel_storage WHERE type = 'public'", {})
    cb(stations)
end)

--
-- METRICS
--
exports("GetMtpMetrics", function()
    local metrics = {}

    metrics["field_percent"] = {}

    -- Field Level
    for name, field in pairs(Fields) do
        local metric = {identifier = name, value = field:GetHealth()}

        table.insert(metrics["field_percent"], metric)
    end

    return metrics
end)
