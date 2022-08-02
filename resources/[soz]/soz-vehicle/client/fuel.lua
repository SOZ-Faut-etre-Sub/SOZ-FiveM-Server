local isFueling = false
local fuelSynced = false

local pistol = {model = "prop_cs_fuel_nozle", pistolObject = nil, rope = nil}
local stationPistolInUse = false
local playerIsInsideStationZone = false

---
--- Vehicle Oil (always provide the virtual oil, the methods will calculate the oil for GTA
---
function GetOil(vehicle)
    return Entity(vehicle).state.oilLevel or GetVehicleHandlingFloat(vehicle, "CHandlingData", "fOilVolume")
end

function SetOil(vehicle, oil)
    if type(oil) == "number" and oil >= 0 and oil <= GetVehicleHandlingFloat(vehicle, "CHandlingData", "fOilVolume") then
        SetVehicleOilLevel(vehicle, oil + 0.0)
        Entity(vehicle).state:set("oilLevel", GetVehicleOilLevel(vehicle), true)
    elseif type(oil) == "number" and oil <= 0 then
        SetVehicleOilLevel(vehicle, 0.0)
        Entity(vehicle).state:set("oilLevel", GetVehicleOilLevel(vehicle), true)
    end
end

function GetOilForHud(vehicle)
    return (GetOil(vehicle) / GetVehicleHandlingFloat(vehicle, "CHandlingData", "fOilVolume")) * 100
end
exports("GetOil", GetOil)
exports("SetOil", SetOil)
exports("GetOilForHud", GetOilForHud)
---
--- Vehicle Fuel
---
function ManageFuelUsage(vehicle)
    if Entity(vehicle).state.fuel == nil then
        SetFuel(vehicle, math.random(200, 800) / 10)
    elseif not fuelSynced then
        SetFuel(vehicle, GetFuel(vehicle))
        fuelSynced = true
    end
    if IsVehicleEngineOn(vehicle) and Config.Classes[GetVehicleClass(vehicle)] > 0 then
        local consumption = Config.FuelUsage[QBCore.Shared.Round(GetVehicleCurrentRpm(vehicle), 1)] * (Config.Classes[GetVehicleClass(vehicle)] or 1.0) / 10
        SetFuel(vehicle, GetVehicleFuelLevel(vehicle) - consumption)
        if GetVehicleHandlingFloat(vehicle, "CHandlingData", "fOilVolume") > 0 then
            SetOil(vehicle, GetVehicleOilLevel(vehicle) - (consumption / Config.oilDivider))
        end
    end
    if GetVehicleHandlingFloat(vehicle, "CHandlingData", "fOilVolume") > 0 and GetOil(vehicle) <= 0 and IsVehicleEngineOn(vehicle) then
        local newEngine = 0
        if (GetVehicleEngineHealth(vehicle) - 50) > 0 then
            newEngine = GetVehicleEngineHealth(vehicle) - 50
        end
        SetVehicleEngineHealth(vehicle, newEngine)
    end
    if GetVehicleHandlingFloat(vehicle, "CHandlingData", "fOilVolume") > 0 and GetOil(vehicle) <= 0 then
        SetVehicleEngineOn(vehicle, false, true, true)
    end
end

CreateThread(function()
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
CreateThread(function()
    while true do
        Wait(1000)
        for vehicle in exports["soz-vehicle"]:EnumerateVehicles() do
            if GetVehicleHandlingFloat(vehicle, "CHandlingData", "fOilVolume") > 0 and
                ((IsVehicleEngineOn(vehicle) and GetOil(vehicle) <= 0.5) or GetOil(vehicle) <= 0) then
                exports["soz-vehicle"]:showLoopParticleAtBone("core", "exp_grd_bzgas_smoke", vehicle, GetEntityBoneIndexByName(vehicle, "engine"), 1.5, 1000)
            end
        end
    end
end)
function HasFuel(vehicle)
    return Config.Classes[GetVehicleClass(vehicle)] > 0
end

function GetFuel(vehicle)
    return Entity(vehicle).state.fuel
end

function SetFuel(vehicle, fuel)
    if type(fuel) == "number" and fuel >= 0 and fuel <= 100 then
        SetVehicleFuelLevel(vehicle, fuel + 0.0)
        Entity(vehicle).state:set("fuel", GetVehicleFuelLevel(vehicle), true)
    end
end

RegisterNetEvent("soz-fuel:client:SetFuel", function(net, newFuel)
    local veh = NetworkGetEntityFromNetworkId(net)
    SetFuel(veh, newFuel)
end)

exports("HasFuel", HasFuel)
exports("GetFuel", GetFuel)
exports("SetFuel", SetFuel)

---
--- Fuel Stations
---
Citizen.CreateThread(function()
    local stations = QBCore.Functions.TriggerRpc("fuel:server:GetStations")

    for _, s in pairs(stations) do
        --- @type FuelStation
        local station = FuelStation:new(s.id, s.station, s.fuel, s.type, s.owner, s.stock, s.price, s.position, s.model, s.zone)

        if station:IsPublic() then
            QBCore.Functions.CreateBlip("station_" .. station.id, {
                name = Config.FuelStations.Blip.Name,
                coords = station:GetCoordinates(),
                sprite = Config.FuelStations.Blip.Sprite,
                color = Config.FuelStations.Blip.Color,
                alpha = Config.FuelStations.Blip.Alpha,
            })
        end

        BoxZone:Create(station:GetPolyZoneConfiguration()):onPlayerInOut(function(isPointInside, _)
            playerIsInsideStationZone = isPointInside
            if isPointInside then
                TriggerEvent("locations:zone:enter", "fueler_petrol_station", station:GetIdentifier())

                exports["qb-target"]:AddTargetModel(station:GetModel(), {
                    options = {
                        {
                            label = "Remplir la station d'essence",
                            color = "oil",
                            icon = "c:fuel/pistolet.png",
                            event = "jobs:client:fueler:StartStationRefill",
                            canInteract = function()
                                return LocalPlayer.state.hasTankerPipe and PlayerData.job.onduty and station:IsEssence()
                            end,
                            job = "oil",
                            blackoutGlobal = true,
                            blackoutJob = true,
                        },
                        {
                            label = "Remplir la station de kérosène",
                            color = "oil",
                            icon = "c:fuel/pistolet.png",
                            event = "jobs:client:fueler:StartKeroseneStationRefill",
                            canInteract = function()
                                return PlayerData.job.onduty and station:IsKerosene()
                            end,
                            item = "kerosene",
                            job = "oil",
                            blackoutGlobal = true,
                            blackoutJob = true,
                        },
                        {
                            label = "État de la station",
                            icon = "c:fuel/pistolet.png",
                            event = "fuel:client:GetFuelLevel",
                            action = function(entity)
                                TriggerEvent("fuel:client:GetFuelLevel", entity, station.id)
                            end,
                            canInteract = function()
                                return station:IsPrivate() or (station:CitizenIsOwner(PlayerData.job.id) or PlayerData.job.id == "oil")
                            end,
                            blackoutGlobal = true,
                        },
                        {
                            icon = "c:fuel/pistolet.png",
                            label = "Pistolet",
                            event = "fuel:client:ActivateStationPistol",
                            canInteract = function(entity)
                                if GetEntityHealth(entity) <= 0 then
                                    return false
                                end

                                if isFueling then
                                    return false
                                end

                                local ped = PlayerPedId()
                                if IsPedInAnyVehicle(ped) then
                                    return false
                                end

                                return station:CitizenHasAccess(PlayerData.job.id)
                            end,
                            blackoutGlobal = true,
                        },
                    },
                    distance = 3.0,
                })

                ---
                --- Setup vehicle fuel actions
                ---
                exports["qb-target"]:AddGlobalVehicle({
                    options = {
                        {
                            icon = "c:fuel/remplir.png",
                            label = "Remplir",
                            action = function(entity)
                                TriggerEvent("fuel:client:UseStationPistol", entity, station:GetIdentifier())
                            end,
                            canInteract = function(entity)
                                if GetEntityHealth(entity) <= 0 then
                                    return false
                                end

                                if isFueling then
                                    return false
                                end

                                local ped = PlayerPedId()
                                if IsPedInAnyVehicle(ped) then
                                    return false
                                end

                                local vehicle = GetPlayersLastVehicle()
                                if DoesEntityExist(GetPedInVehicleSeat(vehicle, -1)) then
                                    return false
                                end

                                return playerIsInsideStationZone and stationPistolInUse
                            end,
                            blackoutGlobal = true,
                        },
                    },
                    distance = 3.0,
                })
            else
                TriggerEvent("locations:zone:exit", "fueler_petrol_station")
                exports["qb-target"]:RemoveTargetEntity(GetPlayersLastVehicle(), "Remplir")
            end
        end)

    end
end)

local function StopObj()
    if pistol.pistolObject ~= nil then
        SetEntityAsMissionEntity(pistol.pistolObject, true, true)
        DeleteEntity(pistol.pistolObject)
        pistol.pistolObject = nil
    end
end

local function ClearFuelingProps()
    RopeUnloadTextures()
    DeleteRope(pistol.rope)
    StopObj()
    pistol.rope = nil
end

RegisterNetEvent("fuel:client:ActivateStationPistol", function(data)
    if stationPistolInUse then
        stationPistolInUse = false
        ClearFuelingProps()
        TriggerServerEvent("InteractSound_SV:PlayWithinDistance", 5, "fuel/end_fuel", 0.3)
        return
    end

    stationPistolInUse = true
    local ped = PlayerPedId()
    local coords = GetEntityCoords(ped)
    local stationEntity = data.entity

    QBCore.Functions.RequestAnimDict("anim@mp_atm@enter")

    TaskTurnPedToFaceEntity(ped, stationEntity, 500)
    Wait(500)

    TaskPlayAnim(ped, "anim@mp_atm@enter", "enter", 8.0, -8.0, -1, 0, 0.0, true, true, true)
    Wait(3000)

    TriggerServerEvent("InteractSound_SV:PlayWithinDistance", 5, "fuel/start_fuel", 0.3)

    if pistol.pistolObject == nil then
        pistol.pistolObject = CreateObject(GetHashKey(pistol.model), coords.x, coords.y, coords.z - 1.0, true, true, true);
        SetNetworkIdCanMigrate(ObjToNet(pistol.pistolObject), false)
        AttachEntityToEntity(pistol.pistolObject, ped, GetPedBoneIndex(ped, 26610), 0.04, -0.04, 0.02, 305.0, 270.0, -40.0, 1, 1, 0, 1, 0, 1)
    end

    RopeLoadTextures()

    if pistol.rope == nil then
        pistol.rope = AddRope(coords.x, coords.y, coords.z, 0.0, 0.0, 0.0, 15.0, 1, 10.0, 1.0, 0, false, true, false, 1.0, false, 0)
        local ropeCoords = GetOffsetFromEntityInWorldCoords(stationEntity, 0.0, 0.0, 1.0)
        AttachRopeToEntity(pistol.rope, stationEntity, ropeCoords, 1)
    end

    CreateThread(function()
        if pistol.rope == nil then
            return
        end

        while pistol.rope ~= nil do
            local ropeCoords = GetOffsetFromEntityInWorldCoords(stationEntity, 0.0, 0.0, 1.0)
            local hCoord = GetWorldPositionOfEntityBone(ped, GetEntityBoneIndexByName(ped, "BONETAG_L_FINGER2"))
            AttachEntitiesToRope(pistol.rope, stationEntity, ped, ropeCoords.x, ropeCoords.y, ropeCoords.z, hCoord.x, hCoord.y, hCoord.z, 1, 1, 1, 0,
                                 "BONETAG_L_FINGER2")

            Citizen.Wait(10)
        end

        ClearFuelingProps()
        isFueling = false
        stationPistolInUse = false
    end)
end)

RegisterNetEvent("fuel:client:UseStationPistol", function(vehicle, stationId)
    local s = QBCore.Functions.TriggerRpc("fuel:server:GetStation", stationId)
    if s == nil then
        return
    end

    local station = FuelStation:new(s.id, s.station, s.fuel, s.type, s.owner, s.stock, s.price, s.position, s.model, s.zone)

    if not station:HasSufficientStock() then
        QBCore.Functions.ShowHelpNotification("~r~La station ne contient pas assez d'essence.")
        ClearFuelingProps()
        return
    end

    if not station:VehicleAccessFuel(vehicle) then
        QBCore.Functions.ShowHelpNotification("~r~Vous n'avez pas accès à cette station.")
        ClearFuelingProps()
        return
    end

    local vehicleFuel = GetFuel(vehicle)
    local vehicleMaxFuel = math.floor(100 - vehicleFuel)

    local maxQuantity = QBCore.Functions.TriggerRpc("fuel:server:RequestRefuel", stationId, vehicleMaxFuel)
    if maxQuantity <= 0 then
        exports["soz-hud"]:DrawNotification("La station ne contient pas assez d'essence.", "error")
        return
    end

    local ped = PlayerPedId()
    isFueling = true

    TaskTurnPedToFaceEntity(ped, vehicle, 1000)

    QBCore.Functions.RequestAnimDict("timetable@gardener@filling_can")
    TaskPlayAnim(ped, "timetable@gardener@filling_can", "gar_ig_5_filling_can", 2.0, 8.0, -1, 50, 0, 0, 0, 0)

    local currentFuelAdd = 0
    local newFuel = vehicleFuel
    local cout = 0
    local max = 99.8

    Citizen.CreateThread(function()
        while isFueling do
            TriggerServerEvent("InteractSound_SV:PlayWithinDistance", 5, "fuel/refueling", 0.3)
            Citizen.Wait(1000)
        end
    end)

    while max > newFuel and (cout == 0 or QBCore.Functions.GetPlayerData().money["money"] > cout) and not IsControlJustReleased(0, 194) and
        not IsControlJustReleased(0, 225) and GetPedInVehicleSeat(vehicle, -1) == 0 do
        currentFuelAdd = currentFuelAdd + 0.02
        newFuel = vehicleFuel + currentFuelAdd

        if station:IsPublic() then
            cout = math.ceil(currentFuelAdd * station:GetPrice())
        end

        DisplayText(newFuel, cout, station.type)
        SetVehicleUndriveable(vehicle, true)
        SetVehicleEngineOn(vehicle, false, false, false)
        DisableAction()
        Wait(0)
    end

    TriggerServerEvent("InteractSound_SV:PlayWithinDistance", 5, "fuel/end_fuel", 0.3)
    ClearPedTasks(ped)
    RemoveAnimDict("timetable@gardener@filling_can")
    if GetPedInVehicleSeat(vehicle, -1) == 0 then
        if station.stock > currentFuelAdd then
            if (cout == 0 or QBCore.Functions.GetPlayerData().money["money"] > cout) then
                local text = "Terminé."

                if station:IsPublic() then
                    text = text .. " Prix final : ~g~" .. cout .. " $"
                end

                QBCore.Functions.ShowHelpNotification(text)
            else
                local text = "Vous ne pouvez pas payer plus."

                if station:IsPublic() then
                    text = text .. " Le prix final est de: ~g~" .. cout .. " $"
                end

                QBCore.Functions.ShowHelpNotification(text)
            end
        else
            local text = "Il n'y a plus d'autre stock dans la station."

            if station:IsPublic() then
                text = text .. " Le prix final est de: ~g~" .. cout .. " $"
            end

            QBCore.Functions.ShowHelpNotification(text)
        end

        QBCore.Functions.TriggerRpc("fuel:server:FinishRefuel", stationId, currentFuelAdd, VehToNet(vehicle))
    else
        QBCore.Functions.ShowHelpNotification("~r~Il ne peut y avoir de conducteur pendant le remplissage du véhicule.")
    end

    isFueling = false
    SetVehicleUndriveable(vehicle, false)
    SetVehicleEngineOn(vehicle, true, false, false)
    ClearFuelingProps()
    stationPistolInUse = false
end)

---
--- Display
---
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

function DisplayText(newFuel, cout, stationType)
    local text = "~INPUT_FRONTEND_RRIGHT~ Arrêter la pompe. Flux: ~g~" .. QBCore.Shared.Round(newFuel, 1) .. "L / 100L"
    if stationType ~= "private" then
        text = text .. " ~w~Coût: ~g~" .. cout .. " $"
    end

    BeginTextCommandDisplayHelp("STRING")
    AddTextComponentSubstringPlayerName(text)
    EndTextCommandDisplayHelp(false, false, false, -1)
end

---
--- Utils
---
RegisterNetEvent("fuel:client:GetFuelLevel", function(entity, stationId)
    local station = QBCore.Functions.TriggerRpc("fuel:server:GetStation", stationId)
    if station == nil then
        return
    end

    TaskTurnPedToFaceEntity(PlayerPedId(), entity, 500)
    Wait(500)

    QBCore.Functions.Progressbar("inspect", "Vous vérifiez le niveau...", 5000, false, true, {
        disableMovement = true,
        disableCombat = true,
    }, {task = "PROP_HUMAN_PARKING_METER"}, {}, {}, function() -- Done
        exports["soz-hud"]:DrawNotification(("Statut de la cuve : ~b~%dL"):format(station.stock), "info")
    end)
end)

RegisterNetEvent("soz-fuel:client:onJerrycanEssence", function()
    local ped = PlayerPedId()
    local vehicle = QBCore.Functions.GetClosestVehicle()
    local model = GetEntityModel(vehicle)
    local fuel = GetFuel(vehicle)

    if IsThisModelAHeli(model) or IsThisModelAPlane(model) then
        exports["soz-hud"]:DrawNotification("Vous ne pouvez pas utiliser ce carburant pour ce véhicule", "error")
        return
    end

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
                QBCore.Functions.TriggerRpc("fuel:server:useJerrycanEssence", VehToNet(vehicle))

                exports["soz-hud"]:DrawNotification("Vous avez ~g~utilisé~s~ un Jerrycan d'Essence")
            end)
        else
            exports["soz-hud"]:DrawNotification("Vous avez ~r~trop d'essence~s~ pour utiliser un jerrycan", "error")
        end
    else
        exports["soz-hud"]:DrawNotification("Vous ne pouvez pas utiliser cet objet dans un véhicule", "error")
    end
end)

RegisterNetEvent("soz-fuel:client:onJerrycanKerosene", function()
    local ped = PlayerPedId()
    local vehicle = QBCore.Functions.GetClosestVehicle()
    local model = GetEntityModel(vehicle)
    local fuel = GetFuel(vehicle)

    if not IsThisModelAHeli(model) and not IsThisModelAPlane(model) then
        exports["soz-hud"]:DrawNotification("Vous ne pouvez pas utiliser ce carburant pour ce véhicule", "error")
        return
    end

    if DoesEntityExist(vehicle) and IsPedOnFoot(ped) then
        if fuel <= 70.0 then
            TaskTurnPedToFaceEntity(ped, vehicle, 500)
            Wait(500)

            QBCore.Functions.Progressbar("fuel_jerrycan_kerosene", "Remplissage du véhicule...", 10000, false, false,
                                         {
                disableMouse = false,
                disableMovement = true,
                disableCarMovement = true,
                disableCombat = true,
            }, {animDict = "timetable@gardener@filling_can", anim = "gar_ig_5_filling_can", flags = 50}, {}, {}, function()
                QBCore.Functions.TriggerRpc("fuel:server:useJerrycanKerosene", VehToNet(vehicle))

                exports["soz-hud"]:DrawNotification("Vous avez ~g~utilisé~s~ un Jerrycan de Kérosène")
            end)
        else
            exports["soz-hud"]:DrawNotification("Vous avez ~r~trop de kérosène~s~ pour utiliser un jerrycan", "error")
        end
    else
        exports["soz-hud"]:DrawNotification("Vous ne pouvez pas utiliser cet objet dans un véhicule", "error")
    end
end)

RegisterNetEvent("soz-fuel:client:onOilJerrycan", function()
    local ped = PlayerPedId()
    local vehicle = QBCore.Functions.GetClosestVehicle()
    local model = GetEntityModel(vehicle)
    local oil = GetOil(vehicle)

    if IsThisModelABicycle(model) then
        exports["soz-hud"]:DrawNotification("Vous ne pouvez pas utiliser ce carburant pour ce véhicule", "error")
        return
    end

    if DoesEntityExist(vehicle) and IsPedOnFoot(ped) then
        if oil / GetVehicleHandlingFloat(vehicle, "CHandlingData", "fOilVolume") <= 0.7 then
            TaskTurnPedToFaceEntity(ped, vehicle, 500)
            Wait(500)

            QBCore.Functions.Progressbar("oil_jerrycan_kerosene", "Remplissage du véhicule...", 10000, false, false,
                                         {
                disableMouse = false,
                disableMovement = true,
                disableCarMovement = true,
                disableCombat = true,
            }, {animDict = "timetable@gardener@filling_can", anim = "gar_ig_5_filling_can", flags = 50}, {}, {}, function()
                QBCore.Functions.TriggerRpc("fuel:server:useOilJerrycan", VehToNet(vehicle), GetVehicleHandlingFloat(vehicle, "CHandlingData", "fOilVolume"))
                SetVehicleOilLevel(vehicle, GetVehicleHandlingFloat(vehicle, "CHandlingData", "fOilVolume") + 0.0)
                exports["soz-hud"]:DrawNotification("Vous avez ~g~utilisé~s~ un bidon d'huile")
            end)
        else
            exports["soz-hud"]:DrawNotification("Vous avez ~r~trop d'huile~s~ pour utiliser un jerrycan", "error")
        end
    else
        exports["soz-hud"]:DrawNotification("Vous ne pouvez pas utiliser cet objet dans un véhicule", "error")
    end
end)
