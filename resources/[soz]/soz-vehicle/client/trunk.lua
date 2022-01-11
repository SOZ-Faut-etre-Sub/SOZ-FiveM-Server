-- TODO: implement key management
local function OpenTrunk()
    if IsPedInAnyVehicle(PlayerPedId(), true) then
        return
    end

    local vehicle, distance = QBCore.Functions.GetClosestVehicle()

    if distance <= 3.0 then
        if GetVehicleDoorLockStatus(vehicle) == 1 then
            local plate = QBCore.Functions.GetPlate(vehicle)
            TriggerServerEvent("inventory:server:openTrunkInventory", plate)
        else
            exports["soz-hud"]:DrawNotification("~r~Véhicule verrouillé")
        end
    end
end

RegisterKeyMapping("vehtrunk", "Ouvrir le coffre du véhicule", "keyboard", "G")
RegisterCommand("vehtrunk", OpenTrunk, false)
