local productionLoopIsRunning = false

function StartProductionLoop()
    productionLoopIsRunning = true

    local count = 0

    Citizen.CreateThread(function()
        while productionLoopIsRunning do
            -- print("##### PRODUCTION TICK #####")

            count = count + 1

            for _, plant in pairs(Plants) do
                if plant:CanProduce() then
                    plant:Produce()
                end

                -- Persist to DB every 5 iterations
                if count >= 5 then
                    plant:save()
                end
            end

            if count >= 5 then
                count = 0
            end

            Citizen.Wait(Config.Production.Tick)
        end
    end)
end

--
-- EVENTS
--
QBCore.Functions.CreateCallback("soz-upw:server:GetPlantActive", function(source, cb, identifier)
    local plant = GetPlant(identifier)

    if plant then
        cb(plant.active)
    else
        cb(nil)
    end
end)

RegisterNetEvent("soz-upw:server:TogglePlantActive", function(data)
    local plant = GetPlant(data.identifier)

    if plant then
        plant:ToggleActive()
    end
end)

local function GetItem(identifier, type)
    if type == "energy" then
        return Config.Plants[identifier].items.energy
    elseif type == "waste" then
        return Config.Plants[identifier].items.energy
    end

    return nil
end

QBCore.Functions.CreateCallback("soz-upw:server:PrecheckHarvest", function(source, cb, identifier)
    local Player = QBCore.Functions.GetPlayer(source)

    local item = GetItem(identifier, "energy")
    if not item then
        cb({false, "invalid item"})
        return
    end

    local canCarry = exports["soz-inventory"]:CanCarryItem(Player.PlayerData.source, item, 1)
    if not canCarry then
        cb({false, "Vos poches sont pleines..."})
        return
    end

    local plant = GetPlant(identifier)

    if not plant:CanEnergyBeHarvested() then
        cb({false, "Pénurie d'énergie"})
        return
    end

    cb({true})
end)

QBCore.Functions.CreateCallback("soz-upw:server:Harvest", function(source, cb, identifier)
    local Player = QBCore.Functions.GetPlayer(source)

    local item = GetItem(identifier, "energy")

    local p = promise:new()

    exports["soz-inventory"]:AddItem(Player.PlayerData.source, item, 1, nil, nil, function(success, reason)
        p:resolve(success, reason)
    end)

    local success, reason = Citizen.Await(p)

    if not success then
        cb(false, reason)
        return
    end

    local plant = GetPlant(identifier)
    plant:HarvestEnergy()

    cb(true)
end)
