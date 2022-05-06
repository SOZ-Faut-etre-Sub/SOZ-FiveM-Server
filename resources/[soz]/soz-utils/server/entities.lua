AddEventHandler("entityCreating", function(handle)
    local entityModel = GetEntityModel(handle)

    if Config.DisabledVehicle[entityModel] or Config.DisabledPeds[entityModel] then
        CancelEvent()
    end
end)
