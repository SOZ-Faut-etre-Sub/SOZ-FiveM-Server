local currentDegradationLevel = Config.Degradation.Level.Green

local function GetDegradationLevel()
    local tree, maxTree = 0, 0

    for _, v in pairs(Fields) do
        local a, t = v:GetFieldStats()
        tree = tree + a
        maxTree = maxTree + t
    end

    local percent = math.floor(tree / maxTree * 100)

    for level, trigger in pairs(Config.Degradation.Threshold) do
        if percent >= trigger then
            return level
        end
    end

    return Config.Degradation.Level.Red
end

QBCore.Functions.CreateCallback("pawl:server:getDegradationLevel", function(source, cb)
    cb(currentDegradationLevel)
end)

Citizen.CreateThread(function()
    while true do
        local newDegradationLevel = GetDegradationLevel()
        exports["soz-monitor"]:Log("INFO", "Wild degradation level updated: " .. newDegradationLevel)

        if currentDegradationLevel ~= newDegradationLevel then
            currentDegradationLevel = newDegradationLevel
            TriggerClientEvent("pawl:client:OnDegradationLevelChanged", -1, currentDegradationLevel)
        end

        Citizen.Wait(Config.Degradation.Tick)
    end
end)
