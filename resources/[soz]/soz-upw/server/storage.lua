local consumptionLoopRunning = false
local facilities = {["inverter"] = GetInverter, ["terminal"] = GetTerminal}

RegisterNetEvent("soz-upw:server:FacilityCapacity", function(data)
    local getter = facilities[data.facility]
    if not getter then
        return
    end

    local facility = getter(data.identifier)
    if facility then
        TriggerClientEvent("soz-core:client:notification:draw", source,
                           string.format("État d'énergie : %s%%", math.floor(facility.capacity / facility.maxCapacity * 100)))
    end
end)

QBCore.Functions.CreateCallback("soz-upw:server:GetInverterStorage", function(source, cb, identifier)
    local items = exports["soz-inventory"]:GetItemsByType("inverter_" .. identifier, "energy")
    local weight = 0
    for _, item in pairs(items) do
        weight = weight + item.item.weight * item.amount
    end

    cb(math.ceil(weight / Config.InverterMaxCapacity * 100))
end)

local function GetTerminals(scope)
    if not scope then
        scope = "default"
    end

    local terminals = {}

    for identifier, terminal in pairs(Terminals) do
        if terminal.scope == scope then
            terminals[identifier] = terminal
        end
    end

    return terminals
end

local function GetTerminalJob(jobId)
    for identifier, terminal in pairs(Terminals) do
        if terminal.scope == "entreprise" and terminal.job == jobId then
            return terminal
        end
    end

    return nil
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

local function GetWorkingTerminals(scope)
    local count, total = 0, 0

    for _, terminal in pairs(GetTerminals(scope)) do
        if terminal.scope == scope then
            local capacity = (terminal.capacity * 100) / terminal.maxCapacity

            total = total + 1

            if capacity >= 1 then
                count = count + 1
            end
        end
    end

    return count, total
end

function GetBlackoutPercent()
    local count, total = GetWorkingTerminals("default")
    local percent = math.ceil(count / total * 100)

    return percent
end

function GetBlackoutLevel()
    local percent = GetBlackoutPercent()

    if percent >= 100 then
        return QBCore.Shared.Blackout.Level.Zero
    end

    for level, range in pairs(Config.Blackout.Threshold) do
        if percent >= range.min and percent < range.max then
            return level
        end
    end

    return QBCore.Shared.Blackout.Level.Zero
end

function IsJobBlackout(job)
    local terminal = GetTerminalJob(job)

    if terminal then
        return terminal:GetEnergyPercent() <= 1
    end

    return false
end

QBCore.Functions.CreateCallback("soz-upw:server:GetBlackoutLevel", function(source, cb)
    cb(GetBlackoutLevel())
end)

QBCore.Functions.CreateCallback("soz-upw:server:IsJobBlackout", function(source, cb, jobId)
    cb(IsJobBlackout(jobId))
end)

--
-- ENERGY CONSUMPTION
--
function StartConsumptionLoop()
    Citizen.CreateThread(function()
        consumptionLoopRunning = true

        while consumptionLoopRunning do
            local connectedPlayers = QBCore.Functions.TriggerRpc("smallresources:server:GetCurrentPlayers")[1]
            local consumptionThisTick = math.ceil(Config.Consumption.EnergyPerTick * connectedPlayers)

            local identifiers = {}
            for identifier, _ in pairs(GetTerminals("default")) do
                table.insert(identifiers, identifier)
            end

            for i = 1, consumptionThisTick, 1 do
                local n = math.random(1, #identifiers)

                for j = 0, #identifiers - 1, 1 do
                    local index = j + n

                    if index > #identifiers then
                        index = index - #identifiers
                    end

                    local terminal = GetTerminal(identifiers[index])

                    if terminal and terminal:CanConsume() then
                        terminal:Consume(1)
                        break
                    end
                end
            end

            local newBlackoutLevel = GetBlackoutLevel()
            local globalState = exports["soz-core"]:GetGlobalState()

            -- Blackout level has changed
            if not globalState.blackoutOverride and globalState.blackoutLevel ~= newBlackoutLevel then
                exports["soz-core"]:SetGlobalState({blackoutLevel = newBlackoutLevel})
            end

            local energies = {}

            -- Handle job terminal consumption
            for jobId, v in pairs(SozJobCore.Jobs) do
                local terminal = GetTerminalJob(jobId)

                if terminal ~= nil then
                    local _, count = QBCore.Functions.GetPlayersOnDuty(jobId)
                    local consumptionJobThisTick = Config.Consumption.EnergyJobPerTick * count

                    if terminal:CanConsume() then
                        terminal:Consume(consumptionJobThisTick)
                    end

                    energies[jobId] = terminal:GetEnergyPercent()
                else
                    energies[jobId] = 100
                end
            end

            exports["soz-core"]:SetJobEnergies(energies)

            Citizen.Wait(Config.Production.Tick)
        end
    end)
end

RegisterNetEvent("soz-upw:server:ConsumeTerminalRatio", function(id, value)
    local terminal = GetTerminal(id);
    if terminal then
        terminal:ConsumeRatio(value)
    end
end)

function ConsumeJobTerminal(jobId, value)
    local terminal = GetTerminalJob(jobId);
    if terminal and terminal:CanConsume() then
        terminal:Consume(value)
    end
end

exports('ConsumeJobTerminal', ConsumeJobTerminal)
