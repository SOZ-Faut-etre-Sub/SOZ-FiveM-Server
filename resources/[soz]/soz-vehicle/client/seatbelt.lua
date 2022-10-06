local seatbeltOn = false
local handbrake = 0
local sleep = 0
local SpeedBuffer = {}
local vehVelocity = {x = 0.0, y = 0.0, z = 0.0}
local newvehicleBodyHealth = 0
local newvehicleEngineHealth = 0
local currentvehicleEngineHealth = 0
local currentvehicleBodyHealth = 0
local frameBodyChange = 0
local frameEngineChange = 0
local lastFrameVehiclespeed = 0
local lastFrameVehiclespeed2 = 0
local thisFrameVehicleSpeed = 0
local tick = 0
local damagedone = false
local modifierDensity = true

-- Register Key

RegisterCommand("toggleseatbelt", function()
    if exports["soz-phone"]:isPhoneVisible() then
        return
    end

    if IsPedInAnyVehicle(PlayerPedId(), false) then
        local class = GetVehicleClass(GetVehiclePedIsUsing(PlayerPedId()))
        if class ~= 8 and class ~= 13 and class ~= 14 then
            if thisFrameVehicleSpeed <= 75 then
                ToggleSeatbelt()
            else
                exports["soz-hud"]:DrawNotification("Vous allez trop vite pour faire ça", "error")
            end
        end
    end
end, false)

RegisterKeyMapping("toggleseatbelt", "Toggle Seatbelt", "keyboard", "K")
-- Functions

local isShuffling = false
function ShufflePlayer()
    if isShuffling then
        return
    end
    local vehicle = GetVehiclePedIsIn(PlayerPedId(), false)
    if vehicle ~= 0 and GetPedInVehicleSeat(vehicle, -1) == GetPlayerPed(PlayerPedId()) and not seatbeltOn and not isShuffling then
        isShuffling = true
        SetPedConfigFlag(PlayerPedId(), 184, false)
        Wait(2000)
        SetPedConfigFlag(PlayerPedId(), 184, true)
        isShuffling = false
    end
end

function ToggleSeatbelt()
    if isShuffling then
        return
    end
    if seatbeltOn then
        TriggerEvent("InteractSound_CL:PlayOnOne", "seatbelt/unbuckle", 0.2)
        Citizen.CreateThread(function()
            Citizen.Wait(3000)
            ShufflePlayer()
        end)
    else
        TriggerEvent("InteractSound_CL:PlayOnOne", "seatbelt/buckle", 0.2)
    end
    seatbeltOn = not seatbeltOn
    TriggerEvent("hud:client:UpdateSeatbelt", seatbeltOn)
end

function ResetHandBrake()
    if handbrake > 0 then
        handbrake = handbrake - 1
    end
end

-- Main Thread

CreateThread(function()
    while true do
        sleep = 1000

        if IsPedInAnyVehicle(PlayerPedId()) then
            sleep = 10
            if seatbeltOn then
                DisableControlAction(0, 75, true)
                DisableControlAction(27, 75, true)
            end
        else
            seatbeltOn = false
        end
        Wait(sleep)
    end
end)

-- Reset Belt state on Enter Vehicle

AddEventHandler("gameEventTriggered", function(name, args)
    if name == "CEventNetworkPlayerEnteredVehicle" and args[1] == PlayerId() then
        TriggerEvent("hud:client:UpdateSeatbelt", false)
        SetPedConfigFlag(PlayerPedId(), 184, true)
        Citizen.CreateThread(function()
            Citizen.Wait(3000)
            ShufflePlayer()
        end)
    end
end)

-- Ejection Logic

CreateThread(function()
    while true do
        Wait(5)
        local playerPed = PlayerPedId()
        local currentVehicle = GetVehiclePedIsIn(playerPed, false)
        local driverPed = GetPedInVehicleSeat(currentVehicle, -1)
        if currentVehicle ~= nil and currentVehicle ~= false and currentVehicle ~= 0 then
            lastVehicle = GetVehiclePedIsIn(playerPed, false)
            if GetVehicleEngineHealth(currentVehicle) < 0.0 then
                SetVehicleEngineHealth(currentVehicle, 0.0)
            end
            if (GetVehicleHandbrake(currentVehicle) or (GetVehicleSteeringAngle(currentVehicle)) > 25.0 or (GetVehicleSteeringAngle(currentVehicle)) < -25.0) then
                if handbrake == 0 then
                    handbrake = 100
                    ResetHandBrake()
                else
                    handbrake = 100
                end
            end

            thisFrameVehicleSpeed = GetEntitySpeed(currentVehicle) * 3.6
            currentvehicleBodyHealth = GetVehicleBodyHealth(currentVehicle)
            if currentvehicleBodyHealth == 1000 and frameBodyChange ~= 0 then
                frameBodyChange = 0
            end
            if frameBodyChange ~= 0 then
                if lastFrameVehiclespeed > 110 and thisFrameVehicleSpeed < (lastFrameVehiclespeed * 0.75) and not damagedone then
                    if frameBodyChange > 18.0 then
                        if not seatbeltOn and not IsThisModelABike(currentVehicle) then
                            if math.random(math.ceil(lastFrameVehiclespeed)) > 60 then
                                EjectFromVehicle()
                            end
                        elseif seatbeltOn and not IsThisModelABike(currentVehicle) then
                            if lastFrameVehiclespeed > 150 then
                                if math.random(math.ceil(lastFrameVehiclespeed)) > 150 then
                                    EjectFromVehicle()
                                end
                            end
                        end
                    else
                        if not seatbeltOn and not IsThisModelABike(currentVehicle) then
                            if math.random(math.ceil(lastFrameVehiclespeed)) > 60 then
                                EjectFromVehicle()
                            end
                        elseif seatbeltOn and not IsThisModelABike(currentVehicle) then
                            if lastFrameVehiclespeed > 120 then
                                if math.random(math.ceil(lastFrameVehiclespeed)) > 200 then
                                    EjectFromVehicle()
                                end
                            end
                        end
                    end
                    damagedone = true
                    SetVehicleEngineOn(currentVehicle, false, true, true)
                end
                if currentvehicleBodyHealth < 350.0 and not damagedone then
                    damagedone = true
                    SetVehicleEngineOn(currentVehicle, false, true, true)
                    Wait(1000)
                end
            end
            if lastFrameVehiclespeed < 100 then
                Wait(100)
                tick = 0
            end
            frameBodyChange = newvehicleBodyHealth - currentvehicleBodyHealth
            if tick > 0 then
                tick = tick - 1
                if tick == 1 then
                    lastFrameVehiclespeed = GetEntitySpeed(currentVehicle) * 3.6
                end
            else
                if damagedone then
                    damagedone = false
                    frameBodyChange = 0
                    lastFrameVehiclespeed = GetEntitySpeed(currentVehicle) * 3.6
                end
                lastFrameVehiclespeed2 = GetEntitySpeed(currentVehicle) * 3.6
                if lastFrameVehiclespeed2 > lastFrameVehiclespeed then
                    lastFrameVehiclespeed = GetEntitySpeed(currentVehicle) * 3.6
                end
                if lastFrameVehiclespeed2 < lastFrameVehiclespeed then
                    tick = 25
                end

            end
            vels = GetEntityVelocity(currentVehicle)
            if tick < 0 then
                tick = 0
            end
            newvehicleBodyHealth = GetVehicleBodyHealth(currentVehicle)
            if not modifierDensity then
                modifierDensity = true
            end
            veloc = GetEntityVelocity(currentVehicle)
        else
            if lastVehicle ~= nil then
                Wait(200)
                newvehicleBodyHealth = GetVehicleBodyHealth(lastVehicle)
                if not damagedone and newvehicleBodyHealth < currentvehicleBodyHealth then
                    damagedone = true
                    SetVehicleEngineOn(lastVehicle, false, true, true)
                    Wait(1000)
                end
                lastVehicle = nil
            end
            lastFrameVehiclespeed2 = 0
            lastFrameVehiclespeed = 0
            newvehicleBodyHealth = 0
            currentvehicleBodyHealth = 0
            frameBodyChange = 0
            Wait(2000)
        end
    end
end)

function GetFwd(entity)
    local hr = GetEntityHeading(entity) + 90.0
    if hr < 0.0 then
        hr = 360.0 + hr
    end
    hr = hr * 0.0174533
    return {x = math.cos(hr) * 5.73, y = math.sin(hr) * 5.73}
end

function EjectFromVehicle()
    local ped = PlayerPedId()
    local veh = GetVehiclePedIsIn(ped, false)
    local coords = GetOffsetFromEntityInWorldCoords(veh, 1.0, 0.0, 1.0)
    SetEntityCoords(ped, coords)
    Wait(1)
    SetPedToRagdoll(ped, 5511, 5511, 0, 0, 0, 0)
    SetEntityVelocity(ped, veloc.x * 3, veloc.y * 3, veloc.z * 3)
    local ejectspeed = math.abs(math.ceil(GetEntitySpeed(ped) * 5))
    if (GetEntityHealth(ped) - (ejectspeed / 1.5)) > 0 then
        SetEntityHealth(ped, (GetEntityHealth(ped) - (ejectspeed / 1.5)))
    elseif GetEntityHealth(ped) ~= 0 then
        SetEntityHealth(ped, 0)
    end
end
