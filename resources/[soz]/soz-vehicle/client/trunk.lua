local tankers = {[GetHashKey("tanker")] = true, [GetHashKey("tanker2")] = true}
local trailerlogs = {[GetHashKey("trailerlogs")] = true}
local brickade = {[GetHashKey("brickade")] = true}

local vehicleTrunkType = function(model)
    if tankers[model] then
        return "tanker"
    elseif trailerlogs[model] then
        return "trailerlogs"
    elseif brickade[model] then
        return "brickade"
    else
        return "trunk"
    end
end

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

                    TriggerServerEvent("inventory:server:openInventory", vehicleTrunkType(model), plate, {
                        model = model,
                        class = class,
                    })
                else
                    exports["soz-hud"]:DrawNotification("Véhicule verrouillé", "info")
                end
            else
                QBCore.Functions.TriggerCallback("vehiclekeys:server:CheckOwnership", function(result)
                    if not result then -- if not player owned
                        local driver = GetPedInVehicleSeat(vehicle, -1)
                        if driver ~= 0 and not IsPedAPlayer(driver) then
                            SetVehicleDoorsLocked(vehicle, 2)
                            exports["soz-hud"]:DrawNotification("Véhicule verrouillé", "error")
                        else
                            if GetVehicleDoorLockStatus(vehicle) == 1 then
                                local model = GetEntityModel(vehicle)
                                local class = GetVehicleClass(vehicle)

                                TriggerServerEvent("inventory:server:openInventory", vehicleTrunkType(model), plate, {
                                    model = model,
                                    class = class,
                                })
                            else
                                exports["soz-hud"]:DrawNotification("Véhicule verrouillé", "info")
                            end
                        end
                    end
                end, plate)
            end
        end, plate)
    end
end

RegisterKeyMapping("vehtrunk", "Ouvrir le coffre du véhicule", "keyboard", "G")
RegisterCommand("vehtrunk", OpenTrunk, false)
