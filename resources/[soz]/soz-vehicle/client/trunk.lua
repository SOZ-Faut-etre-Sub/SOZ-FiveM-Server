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

        local plate = QBCore.Functions.GetPlate(vehicle)

        QBCore.Functions.TriggerCallback("vehiclekeys:server:CheckHasKey", function(result)
            if result then
                if GetVehicleDoorLockStatus(vehicle) == 1 then
                    local model = GetEntityModel(vehicle)
                    local class = GetVehicleClass(vehicle)

                    TriggerServerEvent("inventory:server:openInventory", tankers[model] and "tanker" or "trunk", plate, {
                        model = model,
                        class = class,
                    })
                else
                    exports["soz-hud"]:DrawNotification("Véhicule verrouillé", "info")
                end
            else
                exports["soz-hud"]:DrawNotification("Vous n'avez pas les clés..", "error")
            end
        end, plate)
    end
end

RegisterKeyMapping("vehtrunk", "Ouvrir le coffre du véhicule", "keyboard", "G")
RegisterCommand("vehtrunk", OpenTrunk, false)
