QBCore = exports["qb-core"]:GetCoreObject()

local HudForcedStateDisplay = true
PlayerInVehicle, PlayerHaveGPS, PlayerHaveCompass, AdminGPS = false, false, false, false
HudDisplayed, HudRadar = false, true

--- Global Hud display function
--- @param state boolean
local function setHudDisplay(state)
    if HudDisplayed ~= (HudForcedStateDisplay and state) then
        HudDisplayed = (HudForcedStateDisplay and state)
        SendNUIMessage({action = "display", show = HudDisplayed})
    end
end

--- Radar Hud display function
--- @param state boolean
local function setHudRadar(state)
    if HudRadar ~= state then
        HudRadar = state
        if PlayerHaveGPS or AdminGPS then
            DisplayRadar(HudRadar or AdminGPS)
        else
            DisplayRadar(false)
        end
        SendNUIMessage({action = "speedometer", show = HudRadar})
    end
end

--- UpdateVoiceMode data
--- @param data VoiceData
local function setVoiceData(data)
    local shouldUpdate = false
    for k, v in pairs(data) do
        if HudVoiceStatus[k] ~= v then
            shouldUpdate = true
            break
        end
    end
    HudVoiceStatus = data

    if shouldUpdate then
        SendNUIMessage({action = "voiceMode", voiceMode = data.voiceMode})
    end
end

--- Events


RegisterNetEvent("hud:client:UpdateVoiceMode", function(mode)
    setVoiceData({voiceMode = mode})
end)

RegisterNetEvent("hud:client:OverrideVisibility", function(newState)
    HudForcedStateDisplay = newState
    setHudDisplay(newState)
end)

RegisterNetEvent("phone:camera:enter", function()
    HudForcedStateDisplay = false
    setHudDisplay(false)
end)
RegisterNetEvent("phone:camera:exit", function()
    HudForcedStateDisplay = true
    setHudDisplay(true)
end)
RegisterNetEvent("hud:client:admingps", function(newState)
    AdminGPS = newState
    setHudRadar(true)
end)

CreateThread(function()
    DisplayRadar(false)
    while true do
        local player = PlayerPedId()
        local vehicle = GetVehiclePedIsIn(player)

        if LocalPlayer.state.isLoggedIn then
            setHudDisplay(not IsPauseMenuActive())
            setPlayerData({health = GetEntityHealth(player), armor = GetPedArmour(player)})
            if IsPedInAnyVehicle(player) and not IsThisModelABicycle(vehicle) then
                local class = GetVehicleClass(vehicle)
                local haveLight, lightsOn, highBeamsOn = GetVehicleLightsState(vehicle)
                local vehicle_hash = GetEntityModel(vehicle)

                PlayerInVehicle = true
                setHudRadar(true and HudDisplayed)
                local actualspeed = GetEntitySpeed(vehicle);
                if actualspeed < 0.09 then
                    actualspeed = 0
                end

                local condition = Entity(vehicle).state.condition or {}
                local fuelType = "essence"
                if Config.ElectricCars[vehicle_hash] ~= nil then
                    fuelType = "electric"
                end

                setVehicleData({
                    speed = math.ceil(actualspeed * Config.SpeedMultiplier),
                    fuel = condition.fuelLevel or GetVehicleFuelLevel(vehicle),
                    fuelType = fuelType,
                    hasFuel = class < 23 and class ~= 13,
                    engine = math.ceil(GetVehicleEngineHealth(vehicle)),
                    oil = condition.oilLevel or 100,
                    lock = not Entity(vehicle).state.open,
                    haveSeatbelt = class ~= 8 and class ~= 13 and class ~= 14,
                    haveLight = haveLight,
                    lightsOn = lightsOn,
                    highBeamsOn = highBeamsOn,
                })
            else
                PlayerInVehicle = false
                setHudRadar(false)
            end
        else
            Wait(500)
        end

        Wait(50)
    end
end)
