local tankers = {[GetHashKey("tanker")] = true, [GetHashKey("tanker2")] = true}

-- TODO: implement key management
local function OpenTrunk()
    if IsPedInAnyVehicle(PlayerPedId(), true) then
        return
    end

    local vehicle, distance = QBCore.Functions.GetClosestVehicle()

    if distance <= 3.0 then
        if LocalPlayer.state.inv_busy then
            exports["soz-hud"]:DrawNotification("Inventaire en cours d'utilisation", "warning")
            return
        end

        if GetVehicleDoorLockStatus(vehicle) == 1 then
            local plate = QBCore.Functions.GetPlate(vehicle)
            local model = GetEntityModel(vehicle)

            TriggerServerEvent("inventory:server:openInventory", tankers[model] and "tanker" or "trunk", plate)
        else
            exports["soz-hud"]:DrawNotification("Véhicule verrouillé", "info")
        end
    end
end

RegisterKeyMapping("vehtrunk", "Ouvrir le coffre du véhicule", "keyboard", "G")
RegisterCommand("vehtrunk", OpenTrunk, false)
