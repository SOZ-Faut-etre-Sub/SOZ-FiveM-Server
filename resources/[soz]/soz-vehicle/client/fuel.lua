local isFueling = false
local fuelSynced = false
local ObjectToHand
local CordePompe = 0

function Round(num, numDecimalPlaces)
    local mult = 10 ^ (numDecimalPlaces or 0)
    return math.floor(num * mult + 0.5) / mult
end

function ManageFuelUsage(vehicle)
    if not DecorExistOn(vehicle, Config.FuelDecor) then
        SetFuel(vehicle, math.random(200, 800) / 10)
    elseif not fuelSynced then
        SetFuel(vehicle, GetFuel(vehicle))
        fuelSynced = true
    end
    if IsVehicleEngineOn(vehicle) then
        SetFuel(vehicle, GetVehicleFuelLevel(vehicle) - Config.FuelUsage[Round(GetVehicleCurrentRpm(vehicle), 1)] *
                    (Config.Classes[GetVehicleClass(vehicle)] or 1.0) / 10)
    end
end

CreateThread(function()
    DecorRegister(Config.FuelDecor, 1)
    while true do
        Wait(1000)
        local ped = PlayerPedId()
        if IsPedInAnyVehicle(ped) then
            local vehicle = GetVehiclePedIsIn(ped)
            if GetPedInVehicleSeat(vehicle, -1) == ped then
                ManageFuelUsage(vehicle)
            end
        else
            if fuelSynced then
                fuelSynced = false
            end
        end
    end
end)

function ObjItemAdv(hash, x, y, z, rot1, rot2, rot3)
    local ObjectID = GetHashKey(hash)
    RequestModel(ObjectID)
    while not HasModelLoaded(ObjectID) do
        Citizen.Wait(10)
    end
    local ped = PlayerPedId()
    local playerCoords = GetEntityCoords(ped)
    playerCoords = playerCoords + vector3(0, 0, -1)
    local obj = CreateObject(ObjectID, playerCoords["x"], playerCoords["y"], playerCoords["z"], true, true, true)
    ObjectToHand = obj
    AttachEntityToEntity(ObjectToHand, ped, GetPedBoneIndex(ped, 58866), x, y, z, rot1, rot2, rot3, true, true, false, true, 1, true)
    GiveWeaponToPed(ped, 0xA2719263, 0, 0, 1)
    return ObjectToHand
end

function StopObj()
    if ObjectToHand ~= nil then
        DeleteEntity(ObjectToHand)
        SetEntityAsMissionEntity(ObjectToHand, true, true)
        ObjectToHand = nil
    end
end

function ClearAnimation()
    RopeUnloadTextures()
    DeleteRope(CordePompe)
    StopObj()
    CordePompe = 0
end

function DisableAction()
    -- Mouvements
    DisableControlAction(0, 22, true) -- disable spacebar
    DisableControlAction(0, 23, true) -- disable enter vehicle
    DisableControlAction(0, 30, true) -- disable left/right
    DisableControlAction(0, 31, true) -- disable forward/back
    DisableControlAction(0, 36, true) -- INPUT_DUCK
    DisableControlAction(0, 21, true) -- disable sprint

    -- CarMovements
    DisableControlAction(0, 63, true) -- veh turn left
    DisableControlAction(0, 64, true) -- veh turn right
    DisableControlAction(0, 71, true) -- veh forward
    DisableControlAction(0, 72, true) -- veh backwards
    DisableControlAction(0, 75, true) -- disable exit vehicle

    -- Combat
    DisablePlayerFiring(PlayerId(), true) -- Disable weapon firing
    DisableControlAction(0, 24, true) -- disable attack
    DisableControlAction(0, 25, true) -- disable aim
    DisableControlAction(0, 29, true) -- disable ability secondary (B)
    DisableControlAction(0, 44, true) -- disable cover
    DisableControlAction(1, 37, true) -- disable weapon select
    DisableControlAction(0, 47, true) -- disable weapon
    DisableControlAction(0, 58, true) -- disable weapon
    DisableControlAction(0, 140, true) -- disable melee
    DisableControlAction(0, 141, true) -- disable melee
    DisableControlAction(0, 142, true) -- disable melee
    DisableControlAction(0, 143, true) -- disable melee
    DisableControlAction(0, 263, true) -- disable melee
    DisableControlAction(0, 264, true) -- disable melee
    DisableControlAction(0, 257, true) -- disable melee
end

RegisterNetEvent("fuel:client:GetFuelPomp")
AddEventHandler("fuel:client:GetFuelPomp", function(id, gas, ped, gasentity, vehicle, stationType)
    TaskTurnPedToFaceEntity(ped, gasentity, 500)
    Wait(500)
    QBCore.Functions.RequestAnimDict("anim@mp_atm@enter")
    TaskPlayAnim(ped, "anim@mp_atm@enter", "enter", 8.0, -8.0, -1, 0, 0.0, true, true, true)
    Wait(3000)
    ClearPedTasks(ped)
    RemoveAnimDict("anim@mp_atm@enter")
    TriggerServerEvent("InteractSound_SV:PlayWithinDistance", 5, "fuel/start_fuel", 0.3)
    local ropeSize = 4.5
    local propsName = "prop_cs_fuel_nozle"

    if propsName then
        ObjItemAdv(propsName, 0.06, 0.0, 0.0, 0.0, 0.0, 90.0)
        AttachEntityToEntity(ObjectToHand, PlayerPedId(), GetPedBoneIndex(PlayerPedId(), 26610), 0.04, -0.04, 0.02, 305.0, 270.0, -40.0, 1, 1, 0, 1, 0, 1)
    end

    local pCoords = GetWorldPositionOfEntityBone(PlayerPedId(), GetEntityBoneIndexByName(PlayerPedId(), "BONETAG_L_FINGER2"))
    local vCoords = GetEntityCoords(gasentity)
    vCoords = vector3(vCoords.x, vCoords.y, vCoords.z + 1.0)
    RopeLoadTextures()
    local maxL = ropeSize
    local minL = 0.5
    local initL = ropeSize * 2
    CordePompe = AddRope(pCoords, 0.0, 0.0, 0.0, maxL, 1, initL, minL, 2.0, false, false, false, 1.0, false, 0)

    Citizen.CreateThread(function()
        local obj = gasentity
        while CordePompe ~= 0 do
            Citizen.Wait(10)
            local pCoordsUpdated = GetWorldPositionOfEntityBone(PlayerPedId(), GetEntityBoneIndexByName(PlayerPedId(), "BONETAG_L_FINGER2"))
            AttachEntitiesToRope(CordePompe, PlayerPedId(), obj, pCoordsUpdated, vCoords, 1)
        end
    end)

    exports["qb-target"]:AddTargetEntity(vehicle, {
        options = {
            {
                type = "client",
                icon = "c:fuel/remplir.png",
                label = "Remplir",
                action = function(entity)
                    local ped = PlayerPedId()
                    local vehicle = GetPlayersLastVehicle()
                    TriggerEvent("fuel:client:PumpToCar", id, gasentity, ped, entity, stationType)
                end,
                canInteract = function(entity)
                    local ped = PlayerPedId()
                    if not isFueling then
                        if not IsPedInAnyVehicle(ped) then
                            local vehicle = GetPlayersLastVehicle()
                            local vehicleCoords = GetEntityCoords(vehicle)
                            if DoesEntityExist(vehicle) and #(GetEntityCoords(ped) - vehicleCoords) < 5.0 then
                                if not DoesEntityExist(GetPedInVehicleSeat(vehicle, -1)) then
                                    if GetVehicleFuelLevel(vehicle) < 95 then
                                        return true
                                    else
                                        TriggerEvent("hud:client:DrawNotification", "Le réservoir est plein", "error")
                                        Citizen.Wait(5000)
                                        return false
                                    end
                                else
                                    return false
                                end
                            else
                                return false
                            end
                        else
                            return false
                        end
                    else
                        return false
                    end
                end,
            },
        },
        distance = 3.0,
    })
end)

function DisplayText(newFuel, cout, stationType)
    local text = "~INPUT_CONTEXT~ Arrêter la pompe. Flux: ~g~" .. Round(newFuel, 1) .. "L / 100L"
    if stationType ~= "private" then
        text = text .. " ~w~Coût: ~g~" .. cout .. " $"
    end

    BeginTextCommandDisplayHelp("STRING")
    AddTextComponentSubstringPlayerName(text)
    EndTextCommandDisplayHelp(false, false, false, -1)
end

RegisterNetEvent("fuel:client:PumpToCar")
AddEventHandler("fuel:client:PumpToCar", function(id, gasentity, ped, entity, stationType)
    exports["qb-target"]:RemoveTargetModel(entity, "Remplir")
    local stockstation = QBCore.Functions.TriggerRpc("soz-fuel:server:getfuelstock", id)

    if stockstation > 100 then
        isFueling = true
        TriggerServerEvent("soz-fuel:server:setTempFuel", id)
        local currentFuel = GetVehicleFuelLevel(entity)
        local currentFuelAdd = 0
        local newFuel = currentFuel
        local fueldiff = 0
        local cout = 0
        local max = 99.8

        TaskTurnPedToFaceEntity(ped, entity, 1000)
        QBCore.Functions.RequestAnimDict("timetable@gardener@filling_can")
        TaskPlayAnim(ped, "timetable@gardener@filling_can", "gar_ig_5_filling_can", 2.0, 8.0, -1, 50, 0, 0, 0, 0)
        TriggerServerEvent("InteractSound_SV:PlayWithinDistance", 5, "fuel/refueling", 0.3)

        while max > newFuel and QBCore.Functions.GetPlayerData().money["money"] > cout and not IsControlJustPressed(1, 51) and GetPedInVehicleSeat(entity, -1) ==
            0 and GetEntityHealth(gasentity) > 0 do
            currentFuelAdd = currentFuelAdd + 0.02
            newFuel = currentFuel + currentFuelAdd

            fueldiff = currentFuelAdd / 100
            cout = math.ceil(fueldiff * Config.RefillCost)

            DisplayText(newFuel, cout, stationType)
            SetVehicleUndriveable(entity, true)
            SetVehicleEngineOn(entity, false, false, false)
            DisableAction()
            Wait(0)
        end
        -- voir pk le son continue quand on fait pas E et ne joue pas celui ci-dessous, mais s'arrête quand on fait E et joue celui ci-dessous
        TriggerServerEvent("InteractSound_SV:PlayWithinDistance", 5, "fuel/end_fuel", 0.3)
        ClearPedTasks(ped)
        RemoveAnimDict("timetable@gardener@filling_can")
        if GetPedInVehicleSeat(entity, -1) == 0 then
            if stockstation > currentFuelAdd then
                if QBCore.Functions.GetPlayerData().money["money"] > cout then
                    local text = "Terminé."
                    if stationType ~= "private" then
                        text = text .. " Prix final : ~g~" .. cout .. " $"
                    end
                    QBCore.Functions.ShowHelpNotification(text)
                else
                    local text = "Vous ne pouvez pas payer plus."
                    if stationType ~= "private" then
                        text = text .. " Le prix final est de: ~g~" .. cout .. " $"
                    end
                    QBCore.Functions.ShowHelpNotification(text)
                end
            else
                local text = "Il n'y a plus d'autre stock dans la station."
                if stationType ~= "private" then
                    text = text .. " Le prix final est de: ~g~" .. cout .. " $"
                end
                QBCore.Functions.ShowHelpNotification(text)
            end
            SetFuel(entity, math.floor(newFuel))
            TriggerServerEvent("soz-fuel:server:setFinalFuel", id, (100 - math.floor(currentFuelAdd)))
        else
            QBCore.Functions.ShowHelpNotification("~r~Il ne peut y avoir de conducteur pendant le remplissage du véhicule.")
        end
        isFueling = false
        SetVehicleUndriveable(entity, false)
        SetVehicleEngineOn(entity, true, false, false)
        ClearAnimation()
        if stationType ~= "private" then
            TriggerServerEvent("fuel:pay", tonumber(math.ceil(cout)), GetPlayerServerId(PlayerId()))
        end
    else
        QBCore.Functions.ShowHelpNotification("~r~La station ne contient pas assez d'essence.")
        ClearAnimation()
    end
end)

Citizen.CreateThread(function()
    local stations = QBCore.Functions.TriggerRpc("soz-fuel:server:getStations")

    for _, station in pairs(stations) do
        local position = vector3(station.position.x, station.position.y, station.position.z)
        if station.type == "public" then
            CreateBlip(position)
        end

        local zone = BoxZone:Create(vector3(station.zone.position.x, station.zone.position.y, station.zone.position.z), station.zone.length, station.zone.width,
                                    station.zone.options)

        zone:onPointInOut(PolyZone.getPlayerPosition, function(isPointInside, point)
            if isPointInside then
                TriggerEvent("locations:zone:enter", "fueler_petrol_station", station.id)

                local StationStateJobLimiter = {["oil"] = 0}
                if station.type == "private" and PlayerData.job.id == station.owner then
                    StationStateJobLimiter[station.owner] = 0
                end

                local StationAction = nil
                if station.type == "public" or (station.type == "private" and PlayerData.job.id == station.owner) then
                    StationAction = {
                        type = "client",
                        icon = "c:fuel/pistolet.png",
                        label = "Pistolet",
                        action = function(entity)
                            local ped = PlayerPedId()
                            local vehicle = GetPlayersLastVehicle()
                            TriggerEvent("fuel:client:GetFuelPomp", station.id, zone, ped, entity, vehicle, station.type)
                        end,
                        canInteract = function(entity)
                            local ped = PlayerPedId()
                            if not isFueling then
                                if not IsPedInAnyVehicle(ped) then
                                    local vehicle = GetPlayersLastVehicle()
                                    local vehicleCoords = GetEntityCoords(vehicle)
                                    if DoesEntityExist(vehicle) and #(GetEntityCoords(ped) - vehicleCoords) < 2.5 then
                                        if not DoesEntityExist(GetPedInVehicleSeat(vehicle, -1)) then
                                            if GetVehicleFuelLevel(vehicle) < 95 then
                                                if GetEntityHealth(entity) > 0 then
                                                    return true
                                                else
                                                    exports["soz-hud"]:DrawNotification("La pompe est explosée", "error")
                                                    Citizen.Wait(5000)
                                                end
                                            else
                                                exports["soz-hud"]:DrawNotification("Le réservoir est plein", "error")
                                                Citizen.Wait(5000)
                                                return false
                                            end
                                        else
                                            return false
                                        end
                                    else
                                        return false
                                    end
                                else
                                    return false
                                end
                            else
                                return false
                            end
                        end,
                    }
                end

                exports["qb-target"]:AddTargetModel(station.model, {
                    options = {
                        {
                            label = "Remplir la station",
                            icon = "c:fuel/pistolet.png",
                            event = "jobs:client:fueler:StartStationRefill",
                            canInteract = function()
                                return LocalPlayer.state.hasTankerPipe and PlayerData.job.onduty
                            end,
                            job = "oil",
                        },
                        {
                            label = "État de la station",
                            icon = "c:fuel/pistolet.png",
                            event = "fuel:client:GetFuelLevel",
                            station = station.id,
                            canInteract = function()
                                return station.type == "private"
                            end,
                            job = StationStateJobLimiter,
                        },
                        StationAction,
                    },
                    distance = 3.0,
                })
            else
                TriggerEvent("locations:zone:exit", "fueler_petrol_station")
                exports["qb-target"]:RemoveTargetModel(station.model, "Pistolet")
            end
        end)
    end
end)

function GetFuel(vehicle)
    return DecorGetFloat(vehicle, Config.FuelDecor)
end

function SetFuel(vehicle, fuel)
    if type(fuel) == "number" and fuel >= 0 and fuel <= 100 then
        SetVehicleFuelLevel(vehicle, fuel + 0.0)
        DecorSetFloat(vehicle, Config.FuelDecor, GetVehicleFuelLevel(vehicle))
    end
end

exports("GetFuel", GetFuel)
exports("SetFuel", SetFuel)

function CreateBlip(coords)
    local blip = AddBlipForCoord(coords)
    SetBlipSprite(blip, 361)
    SetBlipScale(blip, 0.8)
    SetBlipColour(blip, 4)
    SetBlipDisplay(blip, 4)
    SetBlipAlpha(blip, 100)
    SetBlipAsShortRange(blip, true)
    BeginTextCommandSetBlipName("STRING")
    AddTextComponentString("Station essence")
    EndTextCommandSetBlipName(blip)
    return blip
end

RegisterNetEvent("fuel:client:GetFuelLevel", function(data)
    local stationFuelLevel = QBCore.Functions.TriggerRpc("soz-fuel:server:getfuelstock", data.station)

    TaskTurnPedToFaceEntity(PlayerPedId(), data.entity, 500)
    Wait(500)

    QBCore.Functions.Progressbar("inspect", "Vous vérifiez le niveau...", 5000, false, true, {
        disableMovement = true,
        disableCombat = true,
    }, {task = "PROP_HUMAN_PARKING_METER"}, {}, {}, function() -- Done
        exports["soz-hud"]:DrawNotification(("Status de la cuve : ~b~%dL"):format(stationFuelLevel), "info")
    end)
end)

RegisterNetEvent("soz-fuel:client:onJerrycanEssence", function()
    local ped = PlayerPedId()
    local vehicle = QBCore.Functions.GetClosestVehicle()
    local fuel = GetFuel(vehicle)

    if DoesEntityExist(vehicle) and IsPedOnFoot(ped) then
        if fuel <= 70.0 then
            TaskTurnPedToFaceEntity(ped, vehicle, 500)
            Wait(500)

            QBCore.Functions.Progressbar("fuel_jerrycan_essence", "Remplissage du véhicule...", 10000, false, false,
                                         {
                disableMouse = false,
                disableMovement = true,
                disableCarMovement = true,
                disableCombat = true,
            }, {animDict = "timetable@gardener@filling_can", anim = "gar_ig_5_filling_can", flags = 50}, {}, {}, function()
                TriggerServerEvent("soz-fuel:server:removeJerrycanEssence")
                SetFuel(vehicle, fuel + 30.0)

                exports["soz-hud"]:DrawNotification("Vous avez ~g~utilisé~s~ un Jerrycan d'Essence")
            end)
        else
            exports["soz-hud"]:DrawNotification("Vous avez ~r~trop d'essence~s~ pour utiliser un jerrycan", "error")
        end
    else
        exports["soz-hud"]:DrawNotification("Vous ne pouvez pas utiliser cet objet dans un véhicule", "error")
    end
end)
