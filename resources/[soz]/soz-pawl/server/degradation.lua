local currentDegradationLevel = Config.Degradation.Level.Green

function GetDegradationPercentage()
    local tree, maxTree = 0, 1

    for _, v in pairs(Fields) do
        local a, t = v:GetFieldStats()
        tree = tree + a
        maxTree = maxTree + t
    end

    return math.floor((tree / maxTree) * 100)
end

local function GetDegradationLevel()
    local percent = GetDegradationPercentage()

    for trigger, level in pairsByKeys(Config.Degradation.Threshold) do
        if percent <= trigger then
            return level
        end
    end

    return Config.Degradation.Level.Green
end

QBCore.Functions.CreateCallback("pawl:server:getDegradationLevel", function(source, cb)
    cb(currentDegradationLevel)
end)

Citizen.CreateThread(function()
    while true do
        local newDegradationLevel = GetDegradationLevel()

        if currentDegradationLevel ~= newDegradationLevel then
            currentDegradationLevel = newDegradationLevel

            exports["soz-monitor"]:Log("INFO", "Wild degradation level updated: " .. newDegradationLevel)
            TriggerClientEvent("pawl:client:OnDegradationLevelChanged", -1, currentDegradationLevel)
        end

        Citizen.Wait(Config.Degradation.Tick)
    end
end)
