QBCore = exports["qb-core"]:GetCoreObject()

RegisterNetEvent("soz-bennys:server:Repair", function(veh, id)
    TriggerClientEvent("soz-bennys:client:Repair", id, veh)
end)

RegisterNetEvent("soz-bennys:server:Clean", function(veh, id)
    TriggerClientEvent("soz-bennys:client:Clean", id, veh)
end)

RegisterNetEvent("soz-bennys:server:EngineRepair", function(veh, id)
    TriggerClientEvent("soz-bennys:client:EngineRepair", id, veh)
end)

RegisterNetEvent("soz-bennys:server:BodyRepair", function(veh, id)
    TriggerClientEvent("soz-bennys:client:BodyRepair", id, veh)
end)

RegisterNetEvent("soz-bennys:server:FuelRepair", function(veh, id)
    TriggerClientEvent("soz-bennys:client:FuelRepair", id, veh)
end)

QBCore.Functions.CreateUseableItem("repairkit", function(source)
    TriggerClientEvent("soz-bennys:client:repairkit", source)
    exports["soz-inventory"]:RemoveItem(source, "repairkit", 1, nil)
end)

QBCore.Functions.CreateUseableItem("cleaningkit", function(source)
    TriggerClientEvent("soz-bennys:client:cleaningkit", source)
    exports["soz-inventory"]:RemoveItem(source, "cleaningkit", 1, nil)
end)
