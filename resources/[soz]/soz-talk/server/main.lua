local QBCore = exports["qb-core"]:GetCoreObject()

--- Use item function
QBCore.Functions.CreateUseableItem("radio", function(source, item)
    TriggerClientEvent("talk:radio:use", source)
end)

QBCore.Functions.CreateUseableItem("megaphone", function(source, item)
    TriggerClientEvent("talk:megaphone:use", source)
end)

QBCore.Functions.CreateUseableItem("microphone", function(source, item)
    TriggerClientEvent("talk:microphone:use", source)
end)

RegisterNetEvent("talk:cibi:sync", function(vehicle, key, value)
    local vehNet = NetworkGetEntityFromNetworkId(vehicle)

    if Entity(vehNet).state.hasRadio then
        Entity(vehNet).state:set(key, value, true)
    end
end)
