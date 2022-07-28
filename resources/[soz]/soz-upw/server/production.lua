local productionLoopIsRunning = false

function StartProductionLoop()
    productionLoopIsRunning = true

    Citizen.CreateThread(function()
        while productionLoopIsRunning do
            for _, plant in pairs(Plants) do
                if plant:CanProduce() then
                    plant:Produce()
                end
            end

            Citizen.Wait(Config.Production.Tick)
        end
    end)
end

function StartBoostLoop()
    Citizen.CreateThread(function()
        while true do
            local boostWindPercent = math.random(80, 160) / 100
            Config.Production.HourBoost.wind1 = boostWindPercent

            Citizen.Wait(1000 * 60 * 60)
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
    local items = {["energy"] = Config.Items.Energy, ["waste"] = {["hydro1"] = Config.Items.Waste.Hydro}}

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

    if harvestType == "terminal-in" then
        local items = exports["soz-inventory"]:GetItemsByType(Player.PlayerData.source, "energy")
        local amount = 0

        for _, itemSlot in pairs(items) do
            amount = amount + itemSlot.amount
        end

        if amount == 0 then
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

    if not facility[facilityData.precheck](facility, item) then
        cb({false, facilityData.messages.precheckError})
        return
    end

    cb({true})
end)

QBCore.Functions.CreateCallback("soz-upw:server:Harvest", function(source, cb, identifier, harvestType)
    local Player = QBCore.Functions.GetPlayer(source)

    local facilityData = GetFacilityData(harvestType)
    local facility = facilityData.getFacility(identifier)
    if not facility then
        cb(false, "invalid facility")
        return
    end

    local item = GetItem(identifier, harvestType)

    local p = promise:new()

    if harvestType == "terminal-in" then
        local items = exports["soz-inventory"]:GetItemsByType(Player.PlayerData.source, "energy")
        local firstItem = items[1]

        if not firstItem then
            cb({false, string.format("Vous n'avez pas l'item requis")})
            return
        end

        item = firstItem.item.name

        -- Remove energy cell from inventory
        local invChanged = exports["soz-inventory"]:RemoveItem(Player.PlayerData.source, firstItem.item.name, 1)

        if invChanged and facility.scope == "default" then
            -- Add payment from San Andreas State on default terminals only
            TriggerEvent("banking:server:TransferMoney", Config.Upw.Accounts.FarmAccount, Config.Upw.Accounts.SafeAccount,
                         Config.Upw.Resale.EnergyCellPriceGlobal[firstItem.item.name] or 0)
        end

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

    facility[facilityData.action](facility, item)

    cb({true, string.format(facilityData.messages.harvestSuccess, QBCore.Shared.Items[item].label)})
end)

QBCore.Functions.CreateCallback("soz-upw:server:GetWaste", function(source, cb, identifier, harvestType)
    local facilityData = GetFacilityData(harvestType)
    local facility = facilityData.getFacility(identifier)
    if not facility then
        cb(false, "invalid facility")
        return
    end

    cb(math.ceil(facility.waste * #Config.FieldHealthStates / facility.maxWaste))
end)
