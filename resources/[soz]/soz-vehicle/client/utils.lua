---Load Vehicle model
---@param modelName string
---@return boolean
function RequestVehicleModel(modelName)
    local model = GetHashKey(modelName)
    if not IsModelInCdimage(model) then
        return
    end
    RequestModel(model)
    local retry = 0
    while not HasModelLoaded(model) or retry < 20 do
        retry = retry + 1
        Citizen.Wait(10)
    end
    return HasModelLoaded(model)
end
exports("RequestVehicleModel", RequestVehicleModel)

---Set vehicle health and modifications
---@param veh number Entity ID
---@param mods table
function SetVehicleProperties(veh, mods, condition, fuel)
    SetVehicleNumberPlateText(veh, mods.plate)

    QBCore.Functions.SetVehicleProperties(veh, mods)
    if condition ~= nil then
        QBCore.Functions.SetVehicleProperties(veh, json.decode(condition))
    end
    exports["soz-vehicle"]:SetFuel(veh, fuel)
    SetEntityAsMissionEntity(veh, true, true)
end
exports("SetVehicleProperties", SetVehicleProperties)
