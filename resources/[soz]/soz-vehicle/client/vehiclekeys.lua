-- Variables
local QBCore = exports["qb-core"]:GetCoreObject()
local HasVehicleKey = false
local AlertSend = false
local lockpicked = false
local lockpickedPlate = nil
local usingAdvanced

-- Functions

local function HasVehicleKey(plate)
    QBCore.Functions.TriggerCallback("vehiclekeys:server:CheckHasKey", function(result)
        if result then
            HasVehicleKey = true
        else
            HasVehicleKey = false
        end
    end, plate)
    return HasVehicleKey
end

local function LockVehicle()
    local ped = PlayerPedId()
    local pos = GetEntityCoords(ped)
    local veh = QBCore.Functions.GetClosestVehicle(pos)
    local plate = QBCore.Functions.GetPlate(veh)
    local vehpos = GetEntityCoords(veh)
    if IsPedInAnyVehicle(ped) then
        veh = GetVehiclePedIsIn(ped)
    end
    if GetEntitySpeed(veh) * 3.6 > 75 then
        exports["soz-hud"]:DrawNotification("Vous allez trop vite pour faire ça", "error")
        return
    end

    if veh ~= nil and #(pos - vehpos) < 7.5 then
        QBCore.Functions.TriggerCallback("vehiclekeys:server:CheckHasKey", function(result)
            if result then
                local vehLockStatus = GetVehicleDoorLockStatus(veh)
                QBCore.Functions.RequestAnimDict("anim@mp_player_intmenu@key_fob@")
                TaskPlayAnim(ped, "anim@mp_player_intmenu@key_fob@", "fob_click", 3.0, 3.0, -1, 49, 0, false, false, false)

                if vehLockStatus == 1 then
                    Wait(750)
                    ClearPedTasks(ped)
                    TriggerServerEvent("InteractSound_SV:PlayWithinDistance", 5, "lock", 0.3)
                    SetVehicleDoorsLocked(veh, 2)
                    if (GetVehicleDoorLockStatus(veh) == 2) then
                        SetVehicleLights(veh, 2)
                        Wait(250)
                        SetVehicleLights(veh, 1)
                        Wait(200)
                        SetVehicleLights(veh, 0)
                        exports["soz-hud"]:DrawNotification("Véhicule verrouillé !")
                    else
                        exports["soz-hud"]:DrawNotification("Problème avec la serrure !")
                    end
                else
                    Wait(750)
                    ClearPedTasks(ped)
                    TriggerServerEvent("InteractSound_SV:PlayWithinDistance", 5, "unlock", 0.3)
                    SetVehicleDoorsLocked(veh, 1)
                    if (GetVehicleDoorLockStatus(veh) == 1) then
                        SetVehicleLights(veh, 2)
                        Wait(250)
                        SetVehicleLights(veh, 1)
                        Wait(200)
                        SetVehicleLights(veh, 0)
                        exports["soz-hud"]:DrawNotification("Véhicule déverrouillé !")
                    else
                        exports["soz-hud"]:DrawNotification("Problème avec la serrure !")
                    end
                end
            else
                exports["soz-hud"]:DrawNotification("Vous n'avez pas les clés..", "error")
            end
        end, plate)
    end
end

local function GetNearbyPed()
    local retval = nil
    local PlayerPeds = {}
    for _, player in ipairs(GetActivePlayers()) do
        local ped = GetPlayerPed(player)
        PlayerPeds[#PlayerPeds + 1] = ped
    end
    local player = PlayerPedId()
    local coords = GetEntityCoords(player)
    local closestPed, closestDistance = QBCore.Functions.GetClosestPed(coords, PlayerPeds)
    if not IsEntityDead(closestPed) and closestDistance < 30.0 then
        retval = closestPed
    end
    return retval
end

local function PoliceCall()
    if not AlertSend then
        local ped = PlayerPedId()
        local pos = GetEntityCoords(ped)
        local chance = Config.PoliceAlertChance
        if GetClockHours() >= 1 and GetClockHours() <= 6 then
            chance = Config.PoliceNightAlertChance
        end
        if math.random() <= chance then
            local closestPed = GetNearbyPed()
            if closestPed ~= nil then
                local msg = ""
                local s1, s2 = GetStreetNameAtCoord(pos.x, pos.y, pos.z)
                local streetLabel = GetStreetNameFromHashKey(s1)
                local street2 = GetStreetNameFromHashKey(s2)
                if street2 ~= nil and street2 ~= "" then
                    streetLabel = streetLabel .. " " .. street2
                end
                local alertTitle = ""
                if IsPedInAnyVehicle(ped) then
                    local vehicle = GetVehiclePedIsIn(ped, false)
                    local modelName = GetDisplayNameFromVehicleModel(GetEntityModel(vehicle)):lower()
                    if QBCore.Shared.Vehicles[modelName] ~= nil then
                        Name = QBCore.Shared.Vehicles[modelName]["brand"] .. " " .. QBCore.Shared.Vehicles[modelName]["name"]
                    else
                        Name = "Inconnu"
                    end
                    local modelPlate = QBCore.Functions.GetPlate(vehicle)
                    local msg = "Vol de véhicule a " .. streetLabel .. ". Véhicule: " .. Name .. ", Immatriculation: " .. modelPlate
                    local alertTitle = "Vol de véhicule a"
                    TriggerServerEvent("police:server:VehicleCall", pos, msg, alertTitle, streetLabel, modelPlate, Name)
                else
                    local vehicle = QBCore.Functions.GetClosestVehicle()
                    local modelName = GetDisplayNameFromVehicleModel(GetEntityModel(vehicle)):lower()
                    local modelPlate = QBCore.Functions.GetPlate(vehicle)
                    if QBCore.Shared.Vehicles[modelName] ~= nil then
                        Name = QBCore.Shared.Vehicles[modelName]["brand"] .. " " .. QBCore.Shared.Vehicles[modelName]["name"]
                    else
                        Name = "Inconnu"
                    end
                    local msg = "Vol de véhicule a " .. streetLabel .. ". Véhicule: " .. Name .. ", Immatriculation: " .. modelPlate
                    local alertTitle = "Vol de véhicule a"
                    TriggerServerEvent("police:server:VehicleCall", pos, msg, alertTitle, streetLabel, modelPlate, Name)
                end
            end
        end
        AlertSend = true
        SetTimeout(Config.AlertCooldown, function()
            AlertSend = false
        end)
    end
end

local function lockpickFinish(success)
    local ped = PlayerPedId()
    local pos = GetEntityCoords(ped)
    local vehicle = QBCore.Functions.GetClosestVehicle(pos)
    local chance = math.random()
    if success then
        TriggerServerEvent("hud:server:GainStress", math.random(1, 4))
        exports["soz-hud"]:DrawNotification("Porte ouverte!")
        SetVehicleDoorsLocked(vehicle, 1)
        lockpicked = true
        lockpickedPlate = QBCore.Functions.GetPlate(vehicle)
    else
        PoliceCall()
        TriggerServerEvent("hud:server:GainStress", math.random(1, 4))
        exports["soz-hud"]:DrawNotification("Quelqu'un a appelé la police!", "error")
    end
    if usingAdvanced then
        if chance <= Config.RemoveLockpickAdvanced then
            TriggerEvent("inventory:client:ItemBox", QBCore.Shared.Items["advancedlockpick"], "remove")
            TriggerServerEvent("QBCore:Server:RemoveItem", "advancedlockpick", 1)
        end
    else
        if chance <= Config.RemoveLockpickNormal then
            TriggerEvent("inventory:client:ItemBox", QBCore.Shared.Items["lockpick"], "remove")
            TriggerServerEvent("QBCore:Server:RemoveItem", "lockpick", 1)
        end
    end
end

local function LockpickDoor(isAdvanced)
    local ped = PlayerPedId()
    local pos = GetEntityCoords(ped)
    local vehicle = QBCore.Functions.GetClosestVehicle(pos)
    if vehicle ~= nil and vehicle ~= 0 then
        local vehpos = GetEntityCoords(vehicle)
        if #(pos - vehpos) < 2.5 then
            local vehLockStatus = GetVehicleDoorLockStatus(vehicle)
            if (vehLockStatus > 0) then
                usingAdvanced = isAdvanced
                TriggerEvent("qb-lockpick:client:openLockpick", lockpickFinish)
            end
        end
    end
end

-- Events

RegisterNetEvent("lockpicks:UseLockpick", function(isAdvanced)
    LockpickDoor(isAdvanced)
end)

RegisterNetEvent("vehiclekeys:client:SetOwner", function(plate)
    local VehPlate = plate
    local CurrentVehPlate = QBCore.Functions.GetPlate(GetVehiclePedIsIn(PlayerPedId(), true))
    if VehPlate == nil then
        VehPlate = CurrentVehPlate
    end
    TriggerServerEvent("vehiclekeys:server:SetVehicleOwner", VehPlate)
    if IsPedInAnyVehicle(PlayerPedId()) and plate == CurrentVehPlate then
        SetVehicleEngineOn(GetVehiclePedIsIn(PlayerPedId(), true), true, false, true)
    end
    HasVehicleKey = true
end)

-- a changer en prêter les clés
--[[
RegisterNetEvent("vehiclekeys:client:GiveKeys", function(target)
    local vehicles = IsPedInAnyVehicle(PlayerPedId())
    if vehicles then
        local plate = QBCore.Functions.GetPlate(GetVehiclePedIsIn(PlayerPedId(), true))
        TriggerServerEvent("vehiclekeys:server:GiveVehicleKeys", plate, target)
    else
        QBCore.Functions.Notify("you need to be in a vehicle to give key", "error")
    end
end)
--]]

RegisterNetEvent("vehiclekeys:client:ToggleEngine", function(EngineOn)
    local veh = GetVehiclePedIsIn(PlayerPedId(), true)
    if HasVehicleKey then
        SetVehicleEngineOn(veh, EngineOn, false, true)
    end
end)

-- command

RegisterKeyMapping("togglelocks", "Toggle Vehicle Locks", "keyboard", "U")
RegisterCommand("togglelocks", function()
    LockVehicle()
end)

-- thread

CreateThread(function()
    while true do
        local sleep = 100
        if LocalPlayer.state.isLoggedIn then
            local ped = PlayerPedId()
            local entering = GetVehiclePedIsTryingToEnter(ped)
            if entering ~= 0 and not Entity(entering).state.ignoreLocks then
                sleep = 2000
                local plate = QBCore.Functions.GetPlate(entering)
                QBCore.Functions.TriggerCallback("vehiclekeys:server:CheckOwnership", function(result)
                    if not result then -- if not player owned
                        local driver = GetPedInVehicleSeat(entering, -1)
                        if driver ~= 0 and not IsPedAPlayer(driver) then
                            SetVehicleDoorsLocked(entering, 2)
                        else
                            QBCore.Functions.TriggerCallback("vehiclekeys:server:CheckHasKey", function(result)
                                if not lockpicked and lockpickedPlate ~= plate then
                                    if result == false then
                                        SetVehicleDoorsLocked(entering, 2)
                                        HasVehicleKey = false
                                    else
                                        HasVehicleKey = true
                                    end
                                elseif lockpicked and lockpickedPlate == plate then
                                    if result == false then
                                        HasVehicleKey = false
                                    else
                                        HasVehicleKey = true
                                    end
                                end
                            end, plate)
                        end
                    end
                end, plate)
            end
        end
        Wait(sleep)
    end
end)
