local QBCore = exports["qb-core"]:GetCoreObject()

--- Use item function
QBCore.Functions.CreateUseableItem("radio", function(source, item)
    TriggerClientEvent("talk:radio:use", source)
end)

RegisterNetEvent("talk:cibi:sync", function(vehicle, key, value)
    Entity(NetworkGetEntityFromNetworkId(vehicle)).state:set(key, value, true)
end)
