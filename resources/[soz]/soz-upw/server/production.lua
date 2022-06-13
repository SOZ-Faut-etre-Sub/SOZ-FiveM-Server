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

local facilities = {
    ["energy"] = {
        config = "Plants",
        getFacility = GetPlant,
        precheck = "CanEnergyBeHarvested",
        message = "Pénurie d'énergie",
        action = "HarvestEnergy",
        item = "energy",
    },
    ["waste"] = {
        config = "Plants",
        getFacility = GetPlant,
        precheck = "CanWasteBeHarvested",
        message = "Pas de déchets à collecter",
        action = "HarvestWaste",
        item = "waste",
    },
    ["inverter-in"] = {
        config = "Inverters",
        getFacility = GetInverter,
        precheck = "CanStoreEnergy",
        message = "Onduleur plein",
        action = "StoreEnergy",
        item = "energy",
    },
    ["inverter-out"] = {
        config = "Inverters",
        getFacility = GetInverter,
        precheck = "CanEnergyBeHarvested",
        message = "Pas assez d'énergie",
        action = "HarvestEnergy",
        item = "energy",
    },
}

local function GetFacilityData(harvestType)
    local facilityData = facilities[harvestType]
    if not facilityData then
        error("Invalid harvest type: " .. harvestType)
    end

    return facilityData
end

local function GetFacilityConfig(identifier, harvestType)
    local facilityData = GetFacilityData(harvestType)

    if Config[facilityData.config] and Config[facilityData.config][identifier] then
        return Config[facilityData.config][identifier]
    end

    error("Invalid facility config: " .. identifier .. " - " .. harvestType)
end

local function GetItem(identifier, harvestType)
    local facilityData = GetFacilityData(harvestType)
    local config = GetFacilityConfig(identifier, harvestType)

    return config.items[facilityData.item]
end

QBCore.Functions.CreateCallback("soz-upw:server:PrecheckHarvest", function(source, cb, identifier, harvestType)
    local Player = QBCore.Functions.GetPlayer(source)

    local item = GetItem(identifier, harvestType)
    if not item then
        cb({false, "invalid item"})
        return
    end

    if harvestType == "inverter-in" then
        -- Does player have item?
        local count = 0
        for _, i in pairs(Player.PlayerData.items or {}) do
            if i.name == item then
                count = i.amount
            end
        end

        if count == 0 then
            cb({false, string.format("Vous n'avez pas de l'item requis")})
            return
        end

    else
        -- Can item be stored in inventory
        local canCarry = exports["soz-inventory"]:CanCarryItem(Player.PlayerData.source, item, 1)

        if not canCarry then
            cb({false, "Vos poches sont pleines..."})
            return
        end
    end

    local facilityData = GetFacilityData(harvestType)
    local facility = facilityData.getFacility(identifier)
    if not facility then
        cb({false, "invalid facility"})
        return
    end

    if not facility[facilityData.precheck](facility) then
        cb({false, facilityData.message})
        return
    end

    cb({true})
end)

QBCore.Functions.CreateCallback("soz-upw:server:Harvest", function(source, cb, identifier, harvestType)
    local Player = QBCore.Functions.GetPlayer(source)

    local item = GetItem(identifier, harvestType)

    local p = promise:new()

    if harvestType == "inverter-in" then
        -- Remove energy cell from inventory
        Player.Functions.RemoveItem(item, 1)

    else
        -- Add energy cell to inventory
        exports["soz-inventory"]:AddItem(Player.PlayerData.source, item, 1, nil, nil, function(success, reason)
            p:resolve(success, reason)
        end)
    end

    local success, reason = Citizen.Await(p)

    if not success then
        cb(false, reason)
        return
    end

    local facilityData = GetFacilityData(harvestType)
    local facility = facilityData.getFacility(identifier)
    if not facility then
        cb(false, "invalid facility")
        return
    end

    facility[facilityData.action](facility)

    cb({true, string.format("Vous avez récolté ~g~1 %s", QBCore.Shared.Items[item].label)})
end)
