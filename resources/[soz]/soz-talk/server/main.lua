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
    local entityModel = GetEntityModel(vehNet)

    if Config.AllowedRadioInVehicle[entityModel] and Entity(vehNet).state.hasRadio then
        Entity(vehNet).state:set(key, value, true)
    end
end)

AddEventHandler("entityCreating", function(handle)
    local entityModel = GetEntityModel(handle)

    if Config.AllowedRadioInVehicle[entityModel] then
        Entity(handle).state:set("hasRadio", true, true)

        Entity(handle).state:set("radioInUse", false, true)
        Entity(handle).state:set("radioEnabled", false, true)

        Entity(handle).state:set("primaryRadio", {frequency = 0.0, volume = 100, ear = 1}, true)
        Entity(handle).state:set("secondaryRadio", {frequency = 0.0, volume = 100, ear = 1}, true)
    else
        Entity(handle).state:set("hasRadio", false, true)
    end
end)
