
RegisterNetEvent("soz-garagist:client:RepaireeePart", function(part)
    local veh = Config.AttachedVehicle
    local plate = QBCore.Functions.GetPlate(veh)
    if part == "engine" then
        SetVehicleEngineHealth(veh, Config.MaxStatusValues[part])
        TriggerServerEvent("soz-garagist:server:updatePart", plate, "engine", Config.MaxStatusValues[part])
    elseif part == "body" then
        local enhealth = GetVehicleEngineHealth(veh)
        SetVehicleBodyHealth(veh, Config.MaxStatusValues[part])
        TriggerServerEvent("soz-garagist:server:updatePart", plate, "body", Config.MaxStatusValues[part])
        SetVehicleFixed(veh)
        SetVehicleEngineHealth(veh, enhealth)
    else
        TriggerServerEvent("soz-garagist:server:updatePart", plate, part, Config.MaxStatusValues[part])
    end
    exports["soz-hud"]:DrawNotification("Le " .. Config.ValuesLabels[part] .. " est réparé!")
end)

RegisterNetEvent("soz-garagist:client:fixEverything", function()
    if (IsPedInAnyVehicle(PlayerPedId(), false)) then
        local veh = GetVehiclePedIsIn(PlayerPedId(), false)
        if not IsThisModelABicycle(GetEntityModel(veh)) and GetPedInVehicleSeat(veh, -1) == PlayerPedId() then
            local plate = QBCore.Functions.GetPlate(veh)
            TriggerServerEvent("soz-garagist:server:fixEverything", plate)
        else
            exports["soz-hud"]:DrawNotification("~r~You Are Not The Driver Or On A Bicycle")
        end
    else
        exports["soz-hud"]:DrawNotification("~r~You Are Not In A Vehicle")
    end
end)

function GetVehicleStatusList(plate)
    local retval = nil
    if VehicleStatus[plate] ~= nil then
        retval = VehicleStatus[plate]
    end
    return retval
end

function GetVehicleStatus(plate, part)
    local retval = nil
    if VehicleStatus[plate] ~= nil then
        retval = VehicleStatus[plate][part]
    end
    return retval
end

function SetVehicleStatus(plate, part, level)
    TriggerServerEvent("soz-garagist:server:updatePart", plate, part, level)
end

exports("GetVehicleStatusList", GetVehicleStatusList)
exports("GetVehicleStatus", GetVehicleStatus)
exports("SetVehicleStatus", SetVehicleStatus)

function ApplyEffects(vehicle)
    local plate = QBCore.Functions.GetPlate(vehicle)
    if GetVehicleClass(vehicle) ~= 13 and GetVehicleClass(vehicle) ~= 21 and GetVehicleClass(vehicle) ~= 16 and GetVehicleClass(vehicle) ~= 15 and
        GetVehicleClass(vehicle) ~= 14 then
        if VehicleStatus[plate] ~= nil then
            local chance = math.random(1, 100)
            if VehicleStatus[plate]["radiator"] <= 80 and (chance >= 1 and chance <= 20) then
                local engineHealth = GetVehicleEngineHealth(vehicle)
                if VehicleStatus[plate]["radiator"] <= 80 and VehicleStatus[plate]["radiator"] >= 60 then
                    SetVehicleEngineHealth(vehicle, engineHealth - math.random(10, 15))
                elseif VehicleStatus[plate]["radiator"] <= 59 and VehicleStatus[plate]["radiator"] >= 40 then
                    SetVehicleEngineHealth(vehicle, engineHealth - math.random(15, 20))
                elseif VehicleStatus[plate]["radiator"] <= 39 and VehicleStatus[plate]["radiator"] >= 20 then
                    SetVehicleEngineHealth(vehicle, engineHealth - math.random(20, 30))
                elseif VehicleStatus[plate]["radiator"] <= 19 and VehicleStatus[plate]["radiator"] >= 6 then
                    SetVehicleEngineHealth(vehicle, engineHealth - math.random(30, 40))
                else
                    SetVehicleEngineHealth(vehicle, engineHealth - math.random(40, 50))
                end
            end

            if VehicleStatus[plate]["axle"] <= 80 and (chance >= 21 and chance <= 40) then
                if VehicleStatus[plate]["axle"] <= 80 and VehicleStatus[plate]["axle"] >= 60 then
                    for i = 0, 360 do
                        SetVehicleSteeringScale(vehicle, i)
                        Wait(5)
                    end
                elseif VehicleStatus[plate]["axle"] <= 59 and VehicleStatus[plate]["axle"] >= 40 then
                    for i = 0, 360 do
                        Wait(10)
                        SetVehicleSteeringScale(vehicle, i)
                    end
                elseif VehicleStatus[plate]["axle"] <= 39 and VehicleStatus[plate]["axle"] >= 20 then
                    for i = 0, 360 do
                        Wait(15)
                        SetVehicleSteeringScale(vehicle, i)
                    end
                elseif VehicleStatus[plate]["axle"] <= 19 and VehicleStatus[plate]["axle"] >= 6 then
                    for i = 0, 360 do
                        Wait(20)
                        SetVehicleSteeringScale(vehicle, i)
                    end
                else
                    for i = 0, 360 do
                        Wait(25)
                        SetVehicleSteeringScale(vehicle, i)
                    end
                end
            end

            if VehicleStatus[plate]["brakes"] <= 80 and (chance >= 41 and chance <= 60) then
                if VehicleStatus[plate]["brakes"] <= 80 and VehicleStatus[plate]["brakes"] >= 60 then
                    SetVehicleHandbrake(vehicle, true)
                    Wait(1000)
                    SetVehicleHandbrake(vehicle, false)
                elseif VehicleStatus[plate]["brakes"] <= 59 and VehicleStatus[plate]["brakes"] >= 40 then
                    SetVehicleHandbrake(vehicle, true)
                    Wait(3000)
                    SetVehicleHandbrake(vehicle, false)
                elseif VehicleStatus[plate]["brakes"] <= 39 and VehicleStatus[plate]["brakes"] >= 20 then
                    SetVehicleHandbrake(vehicle, true)
                    Wait(5000)
                    SetVehicleHandbrake(vehicle, false)
                elseif VehicleStatus[plate]["brakes"] <= 19 and VehicleStatus[plate]["brakes"] >= 6 then
                    SetVehicleHandbrake(vehicle, true)
                    Wait(7000)
                    SetVehicleHandbrake(vehicle, false)
                else
                    SetVehicleHandbrake(vehicle, true)
                    Wait(9000)
                    SetVehicleHandbrake(vehicle, false)
                end
            end

            if VehicleStatus[plate]["clutch"] <= 80 and (chance >= 61 and chance <= 80) then
                if VehicleStatus[plate]["clutch"] <= 80 and VehicleStatus[plate]["clutch"] >= 60 then
                    SetVehicleHandbrake(vehicle, true)
                    SetVehicleEngineOn(vehicle, 0, 0, 1)
                    SetVehicleUndriveable(vehicle, true)
                    Wait(50)
                    SetVehicleEngineOn(vehicle, 1, 0, 1)
                    SetVehicleUndriveable(vehicle, false)
                    for i = 1, 360 do
                        SetVehicleSteeringScale(vehicle, i)
                        Wait(5)
                    end
                    Wait(500)
                    SetVehicleHandbrake(vehicle, false)
                elseif VehicleStatus[plate]["clutch"] <= 59 and VehicleStatus[plate]["clutch"] >= 40 then
                    SetVehicleHandbrake(vehicle, true)
                    SetVehicleEngineOn(vehicle, 0, 0, 1)
                    SetVehicleUndriveable(vehicle, true)
                    Wait(100)
                    SetVehicleEngineOn(vehicle, 1, 0, 1)
                    SetVehicleUndriveable(vehicle, false)
                    for i = 1, 360 do
                        SetVehicleSteeringScale(vehicle, i)
                        Wait(5)
                    end
                    Wait(750)
                    SetVehicleHandbrake(vehicle, false)
                elseif VehicleStatus[plate]["clutch"] <= 39 and VehicleStatus[plate]["clutch"] >= 20 then
                    SetVehicleHandbrake(vehicle, true)
                    SetVehicleEngineOn(vehicle, 0, 0, 1)
                    SetVehicleUndriveable(vehicle, true)
                    Wait(150)
                    SetVehicleEngineOn(vehicle, 1, 0, 1)
                    SetVehicleUndriveable(vehicle, false)
                    for i = 1, 360 do
                        SetVehicleSteeringScale(vehicle, i)
                        Wait(5)
                    end
                    Wait(1000)
                    SetVehicleHandbrake(vehicle, false)
                elseif VehicleStatus[plate]["clutch"] <= 19 and VehicleStatus[plate]["clutch"] >= 6 then
                    SetVehicleHandbrake(vehicle, true)
                    SetVehicleEngineOn(vehicle, 0, 0, 1)
                    SetVehicleUndriveable(vehicle, true)
                    Wait(200)
                    SetVehicleEngineOn(vehicle, 1, 0, 1)
                    SetVehicleUndriveable(vehicle, false)
                    for i = 1, 360 do
                        SetVehicleSteeringScale(vehicle, i)
                        Wait(5)
                    end
                    Wait(1250)
                    SetVehicleHandbrake(vehicle, false)
                else
                    SetVehicleHandbrake(vehicle, true)
                    SetVehicleEngineOn(vehicle, 0, 0, 1)
                    SetVehicleUndriveable(vehicle, true)
                    Wait(250)
                    SetVehicleEngineOn(vehicle, 1, 0, 1)
                    SetVehicleUndriveable(vehicle, false)
                    for i = 1, 360 do
                        SetVehicleSteeringScale(vehicle, i)
                        Wait(5)
                    end
                    Wait(1500)
                    SetVehicleHandbrake(vehicle, false)
                end
            end

            if VehicleStatus[plate]["fuel"] <= 80 and (chance >= 81 and chance <= 100) then
                local fuel = exports["soz-vehicle"]:GetFuel(vehicle)
                if VehicleStatus[plate]["fuel"] <= 80 and VehicleStatus[plate]["fuel"] >= 60 then
                    exports["soz-vehicle"]:SetFuel(vehicle, fuel - 2.0)
                elseif VehicleStatus[plate]["fuel"] <= 59 and VehicleStatus[plate]["fuel"] >= 40 then
                    exports["soz-vehicle"]:SetFuel(vehicle, fuel - 4.0)
                elseif VehicleStatus[plate]["fuel"] <= 39 and VehicleStatus[plate]["fuel"] >= 20 then
                    exports["soz-vehicle"]:SetFuel(vehicle, fuel - 6.0)
                elseif VehicleStatus[plate]["fuel"] <= 19 and VehicleStatus[plate]["fuel"] >= 6 then
                    exports["soz-vehicle"]:SetFuel(vehicle, fuel - 8.0)
                else
                    exports["soz-vehicle"]:SetFuel(vehicle, fuel - 10.0)
                end
            end
        end
    end
end

RegisterNetEvent("soz-garagist:client:setVehicleStatus", function(plate, status)
    VehicleStatus[plate] = status
end)

RegisterNetEvent("soz-garagist:client:getVehicleStatus", function(plate, status)
    if not (IsPedInAnyVehicle(PlayerPedId(), false)) then
        local veh = GetVehiclePedIsIn(PlayerPedId(), true)
        if veh ~= nil and veh ~= 0 then
            local vehpos = GetEntityCoords(veh)
            local pos = GetEntityCoords(PlayerPedId())
            if #(pos - vehpos) < 5.0 then
                if not IsThisModelABicycle(GetEntityModel(veh)) then
                    local plate = QBCore.Functions.GetPlate(veh)
                    if VehicleStatus[plate] ~= nil then
                        SendStatusMessage(VehicleStatus[plate])
                    else
                        exports["soz-hud"]:DrawNotification("~r~Etat inconnu")
                    end
                else
                    exports["soz-hud"]:DrawNotification("~r~Véhicule invalide")
                end
            else
                exports["soz-hud"]:DrawNotification("~r~Vous n'êtes pas assez proche du véhicule")
            end
        else
            exports["soz-hud"]:DrawNotification("~r~Vous devez d'abord être dans un véhicule")
        end
    else
        exports["soz-hud"]:DrawNotification("~r~Vous devez être à l'extérieur du véhicule")
    end
end)

RegisterNetEvent("soz-garagist:client:repairPart", function(part, level, needAmount)
    if IsPedInAnyVehicle(PlayerPedId(), true) then
        local veh = GetVehiclePedIsIn(PlayerPedId(), true)
        if veh ~= nil and veh ~= 0 then
            local vehpos = GetEntityCoords(veh)
            local pos = GetEntityCoords(PlayerPedId())
            if #(pos - vehpos) < 5.0 then
                if not IsThisModelABicycle(GetEntityModel(veh)) then
                    local plate = QBCore.Functions.GetPlate(veh)
                    if VehicleStatus[plate] ~= nil and VehicleStatus[plate][part] ~= nil then
                        local lockpickTime = (1000 * level)
                        if part == "body" then
                            lockpickTime = lockpickTime / 10
                        end
                        ScrapAnim(lockpickTime)
                        QBCore.Functions.Progressbar("repair_advanced", "Repair Vehicle", lockpickTime, false, true,
                                                     {
                            disableMovement = true,
                            disableCarMovement = true,
                            disableMouse = false,
                            disableCombat = true,
                        }, {animDict = "mp_car_bomb", anim = "car_bomb_mechanic", flags = 16}, {}, {}, function() -- Done
                            openingDoor = false
                            ClearPedTasks(PlayerPedId())
                            if part == "body" then
                                local enhealth = GetVehicleEngineHealth(veh)
                                SetVehicleBodyHealth(veh, GetVehicleBodyHealth(veh) + level)
                                SetVehicleFixed(veh)
                                SetVehicleEngineHealth(veh, enhealth)
                                TriggerServerEvent("soz-garagist:server:updatePart", plate, part, GetVehicleBodyHealth(veh))
                                TriggerServerEvent("QBCore:Server:RemoveItem", Config.RepairCost[part], needAmount)
                                TriggerEvent("inventory:client:ItemBox", QBCore.Shared.Items[Config.RepairCost[part]], "remove")
                            elseif part ~= "engine" then
                                TriggerServerEvent("soz-garagist:server:updatePart", plate, part, GetVehicleStatus(plate, part) + level)
                                TriggerServerEvent("QBCore:Server:RemoveItem", Config.RepairCost[part], level)
                                TriggerEvent("inventory:client:ItemBox", QBCore.Shared.Items[Config.RepairCost[part]], "remove")
                            end
                        end, function() -- Cancel
                            openingDoor = false
                            ClearPedTasks(PlayerPedId())
                            exports["soz-hud"]:DrawNotification("~r~Process Canceled")
                        end)
                    else
                        exports["soz-hud"]:DrawNotification("~r~Not A Valid Part")
                    end
                else
                    exports["soz-hud"]:DrawNotification("~r~Not A Valid Vehicle")
                end
            else
                exports["soz-hud"]:DrawNotification("~r~You Are Not Close Enough To The Vehicle")
            end
        else
            exports["soz-hud"]:DrawNotification("~r~You Must Be In The Vehicle First")
        end
    else
        exports["soz-hud"]:DrawNotification("~r~Youre Not In a Vehicle")
    end
end)
