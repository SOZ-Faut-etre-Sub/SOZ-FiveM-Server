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
