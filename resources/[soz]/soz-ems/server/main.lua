RegisterNetEvent("soz-ems:server:setLit", function(id, isUsed)
    TriggerEvent("soz-ems:client:lit", -1, id, isUsed)
end)
