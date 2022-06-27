local currentBlackoutLevel = QBCore.Shared.Blackout.Level.Zero
local consumptionLoopRunning = false
local facilities = {["inverter"] = GetInverter, ["terminal"] = GetTerminal}

RegisterNetEvent("soz-upw:server:FacilityCapacity", function(data)
    local getter = facilities[data.facility]
    if not getter then
        return
    end

    local facility = getter(data.identifier)
    if facility then
        TriggerClientEvent("hud:client:DrawNotification", source,
                           string.format("Remplissage : %s%%", math.floor(facility.capacity / facility.maxCapacity * 100)))
    end
end)

local function GetTerminals(scope)
    if not scope then
        scope = "default"
    end

    local terminals = {}

    for identifier, terminal in pairs(Terminals) do
        if terminal.scope == "default" then
            terminals[identifier] = terminal
        end
    end

    return terminals
end

local function GetTerminalCapacities(scope)
    local capacity, maxCapacity = 0, 0

    for _, terminal in pairs(GetTerminals(scope)) do
        if terminal.scope == scope then
            capacity = capacity + terminal.capacity
            maxCapacity = maxCapacity + terminal.maxCapacity
        end
    end

    return capacity, maxCapacity
end

local function GetBlackoutLevel()
    -- Force to Blackout level Zero for now
    return QBCore.Shared.Blackout.Level.Zero

    --[[
    local capacity, maxCapacity = GetTerminalCapacities("default")
    local percent = math.ceil(capacity / maxCapacity * 100)

    if percent >= 100 then
        return QBCore.Shared.Blackout.Level.Zero
    end

    for level, range in pairs(Config.Blackout.Threshold) do
        if percent >= range.min and percent < range.max then
            return level
        end
    end
    ]]
end

QBCore.Functions.CreateCallback("soz-upw:server:GetBlackoutLevel", function(source, cb)
    cb(GetBlackoutLevel())
end)

--
-- ENERGY CONSUMPTION
--
function StartConsumptionLoop()
    Citizen.CreateThread(function()
        consumptionLoopRunning = true

        while consumptionLoopRunning do
            local connectedPlayers = QBCore.Functions.TriggerRpc("smallresources:server:GetCurrentPlayers")[1]

            local consumptionThisTick = Config.Consumption.EnergyPerTick * connectedPlayers

            local identifiers = {}
            for identifier, _ in pairs(GetTerminals("default")) do
                table.insert(identifiers, identifier)
            end

            for i = 1, consumptionThisTick, 1 do
                local n = math.random(1, #identifiers)
                local terminal = GetTerminal(identifiers[n])

                if terminal then
                    terminal:Consume(1)
                end
            end

            local newBlackoutLevel = GetBlackoutLevel()
            exports["soz-monitor"]:Log("INFO", "Blackout level updated: " .. newBlackoutLevel)

            -- Blackout level has changed
            if currentBlackoutLevel ~= newBlackoutLevel then
                local previousBlackoutLevel = currentBlackoutLevel
                currentBlackoutLevel = newBlackoutLevel
                TriggerEvent("soz-upw:server:OnBlackoutLevelChanged", newBlackoutLevel, previousBlackoutLevel)
                TriggerClientEvent("soz-upw:client:OnBlackoutLevelChanged", -1, newBlackoutLevel, previousBlackoutLevel)
            end

            Citizen.Wait(Config.Production.Tick)
        end
    end)
end
