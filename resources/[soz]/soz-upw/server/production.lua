local productionLoopIsRunning = false

function StartProductionLoop()
    productionLoopIsRunning = true

    local count = 0

    Citizen.CreateThread(function()
        while productionLoopIsRunning do

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

            for _, facilities in ipairs({Inverters, Terminals}) do
                for _, facility in pairs(facilities) do
                    if count >= 5 then
                        facility:save()
                    end
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
        getFacility = GetPlant,
        precheck = "CanEnergyBeHarvested",
        messages = {precheckError = "Pénurie d'énergie", harvestSuccess = "Vous avez récolté ~g~1 %s"},
        action = "HarvestEnergy",
        item = "energy",
    },
    ["waste"] = {
        getFacility = GetPlant,
        precheck = "CanWasteBeHarvested",
        messages = {precheckError = "Pas de déchets à collecter", harvestSuccess = "Vous avez récolté ~g~1 %s"},
        action = "HarvestWaste",
        item = "waste",
    },
    ["inverter-in"] = {
        getFacility = GetInverter,
        precheck = "CanStoreEnergy",
        messages = {precheckError = "Onduleur plein", harvestSuccess = "Vous avez déposé ~g~1 %s"},
        action = "StoreEnergy",
        item = "energy",
    },
    ["inverter-out"] = {
        getFacility = GetInverter,
        precheck = "CanEnergyBeHarvested",
        messages = {precheckError = "Pas assez d'énergie", harvestSuccess = "Vous avez récolté ~g~1 %s"},
        action = "HarvestEnergy",
        item = "energy",
    },
    ["terminal-in"] = {
        getFacility = GetTerminal,
        precheck = "CanStoreEnergy",
        messages = {precheckError = "Borne pleine", harvestSuccess = "Vous avez déposé ~g~1 %s"},
        action = "StoreEnergy",
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

local function GetItem(identifier, harvestType)
    local items = {
        ["energy"] = Config.Items.Energy,
        ["waste"] = {
            ["hydro1"] = Config.Items.Waste.Hydro
        },
    }

    local facilityData = GetFacilityData(harvestType)

    if type(items[harvestType]) == "table" then
        return items[facilityData.item][identifier]
    end

    return items[facilityData.item]
end

QBCore.Functions.CreateCallback("soz-upw:server:PrecheckHarvest", function(source, cb, identifier, harvestType)
    local Player = QBCore.Functions.GetPlayer(source)

    local item = GetItem(identifier, harvestType)
    if not item then
        cb({false, "invalid item"})
        return
    end

    if harvestType == "inverter-in" or harvestType == "terminal-in" then
        -- Does player have item?
        local count = exports["soz-inventory"]:GetItem(Player.PlayerData.source, item, nil, true)

        if count == 0 then
            cb({false, string.format("Vous n'avez pas l'item requis")})
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
        cb({false, facilityData.messages.precheckError})
        return
    end

    cb({true})
end)

QBCore.Functions.CreateCallback("soz-upw:server:Harvest", function(source, cb, identifier, harvestType)
    local Player = QBCore.Functions.GetPlayer(source)

    local item = GetItem(identifier, harvestType)

    local p = promise:new()

    if harvestType == "inverter-in" or harvestType == "terminal-in" then
        -- Remove energy cell from inventory
        exports["soz-inventory"]:RemoveItem(Player.PlayerData.source, item, 1)

        p:resolve(true, nil)
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

    cb({true, string.format(facilityData.messages.harvestSuccess, QBCore.Shared.Items[item].label)})
end)
