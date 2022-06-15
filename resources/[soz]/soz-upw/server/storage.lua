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

local function GetTerminalCapacities(scope)
    if not scope then
        scope = "default"
    end

    local capacity, maxCapacity = 0, 0

    for _, terminal in pairs(Terminals) do
        if terminal.scope == scope then
            capacity = capacity + terminal.capacity
            maxCapacity = maxCapacity + terminal.maxCapacity
        end
    end
end

QBCore.Functions.CreateCallback("soz-upw:server:GetBlackoutLevel", function(source, cb)
    local capacity, maxCapacity = GetTerminalCapacities("default")
    local percent = math.ceil(capacity / maxCapacity * 100)

    if percent >= 100 then
        cb(QBCore.Shared.Blackout.Level.Zero)
        return
    end

    for level, range in pairs(Config.Blackout.Threshold) do
        if percent >= range.min and percent < range.max then
            cb(level)
        end
    end
end)
