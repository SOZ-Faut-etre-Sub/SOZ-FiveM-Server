--
-- INVERTERS
--
RegisterNetEvent("soz-upw:client:InverterCapacity", function(data)
    local inverter = GetInverter(data.identifier)

    if inverter then
        TriggerClientEvent("hud:client:DrawNotification", source,
                           string.format("Remplissage : %s%%", math.floor(inverter.capacity / inverter.maxCapacity * 100)))
    end
end)
