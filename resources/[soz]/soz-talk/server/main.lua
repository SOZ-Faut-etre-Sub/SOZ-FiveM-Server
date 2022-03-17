local QBCore = exports["qb-core"]:GetCoreObject()

--- Use item function
QBCore.Functions.CreateUseableItem("radio", function(source, item)
    TriggerClientEvent("talk:radio:use", source)
end)

RegisterNetEvent("talk:cibi:sync", function(vehicle, key, value)
    local vehNet = NetworkGetEntityFromNetworkId(vehicle)

    if Entity(vehNet).state.hasRadio then
        Entity(vehNet).state:set(key, value, true)
    end
end)

AddEventHandler("entityCreating", function(handle)
    local entityModel = GetEntityModel(handle)

    if Config.AllowedRadioInVehicle[entityModel] then
        Entity(handle).state:set("hasRadio", true, true)
    else
        Entity(handle).state:set("hasRadio", false, true)
    end
end)
