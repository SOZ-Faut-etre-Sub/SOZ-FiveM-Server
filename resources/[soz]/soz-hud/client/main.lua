local QBCore = exports["qb-core"]:GetCoreObject()

local HudForcedStateDisplay = true
PlayerInVehicle, PlayerHaveGPS, PlayerHaveCompass, PlayerHaveHouseMap = false, false, false, false
HudDisplayed, HudRadar = false, true
--- @class PlayerData
local HudPlayerStatus = {
    --- @type number
    health = 200,
    --- @type number
    armor = 0,
    --- @type number
    hunger = 100,
    --- @type number
    thirst = 100,
    --- @type number
    alcohol = 0,
    --- @type number
    drug = 0,
}
--- @class VehicleData
local HudVehicleStatus = {
    --- @type boolean
    haveSeatbelt = false,
    --- @type number
    speed = 0,
    --- @type number
    fuel = 100,
    --- @type number
    engine = 1000,
    --- @type number
    lock = 4,
    --- @type boolean
    haveLight = false,
    --- @type boolean
    lightsOn = false,
    --- @type boolean
    highBeamsOn = false,
}
--- @class VoiceData
local HudVoiceStatus = {
    --- @type number
    voiceMode = 0,
}

--- Update Functions

RegisterNetEvent("QBCore:Player:SetPlayerData", function(PlayerData)
    PlayerHaveGPS, PlayerHaveCompass = false, false
    for _, item in pairs(PlayerData.items or {}) do
        if item.name == "gps" then
            PlayerHaveGPS = true
        end
        if item.name == "compass" then
            PlayerHaveCompass = true
        end
        if item.name == "house_map" then
            PlayerHaveHouseMap = true
        end
    end
end)

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
        if PlayerHaveGPS then
            DisplayRadar(HudRadar)
        else
            DisplayRadar(false)
        end
        SendNUIMessage({action = "speedometer", show = HudRadar})
    end
end

--- Update PlayerStatus data
--- @param data PlayerData
local function setPlayerData(data)
    local shouldUpdate = false
    for k, v in pairs(data) do
        if HudPlayerStatus[k] ~= v then
            shouldUpdate = true
            break
        end
    end
    HudPlayerStatus = data

    if shouldUpdate then
        SendNUIMessage({
            action = "update_needs",
            health = data.health,
            armor = data.armor,
            hunger = data.hunger,
            thirst = data.thirst,
            alcohol = data.alcohol,
            drug = data.drug,
        })
    end
end

--- Update VehicleData
--- @param data VehicleData
local function setVehicleData(data)
    local shouldUpdate = false
    for k, v in pairs(data) do
        if HudVehicleStatus[k] ~= v then
            HudVehicleStatus[k] = v
            shouldUpdate = true
        end
    end

    if shouldUpdate then
        SendNUIMessage({
            action = "update_vehicle",
            speed = HudVehicleStatus.speed,
            fuel = HudVehicleStatus.fuel,
            engine = HudVehicleStatus.engine,
            lock = HudVehicleStatus.lock,
            haveSeatbelt = HudVehicleStatus.haveSeatbelt,
            haveLight = HudVehicleStatus.haveLight,
            lightsOn = HudVehicleStatus.lightsOn,
            highBeamsOn = HudVehicleStatus.highBeamsOn,
        })
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

--- Populate value at player login
RegisterNetEvent("QBCore:Client:OnPlayerLoaded", function()
    ForceCloseTextInputBox() -- Ensure last input is closed
    setHudDisplay(true)
    QBCore.Functions.GetPlayerData(function(data)
        setPlayerData({
            health = data.metadata["health"],
            hunger = data.metadata["hunger"],
            thirst = data.metadata["thirst"],
            alcohol = data.metadata["alcohol"],
            drug = data.metadata["drug"],
            armor = data.metadata["armor"],
        })
    end)
end)

RegisterNetEvent("QBCore:Player:SetPlayerData", function(PlayerData)
    setPlayerData({armor = PlayerData.metadata["armor"]})
end)

RegisterNetEvent("QBCore:Client:OnPlayerUnload", function()
    setHudDisplay(false)
end)

RegisterNetEvent("hud:client:UpdateVoiceMode", function(mode)
    setVoiceData({voiceMode = mode})
end)

--- Keep same name as qb-hud
RegisterNetEvent("hud:client:UpdateNeeds", function(newHunger, newThirst, newAlcohol, newDrug)
    setPlayerData({hunger = newHunger, thirst = newThirst, alcohol = newAlcohol, drug = newDrug})
end)

RegisterNetEvent("hud:client:UpdateSeatbelt", function(newState)
    setVehicleData({haveSeatbelt = newState})
end)

RegisterNetEvent("hud:client:OverrideVisibility", function(newState)
    HudForcedStateDisplay = newState
    setHudDisplay(newState)
end)

RegisterNetEvent("phone:camera:enter", function()
    setHudDisplay(false)
end)
RegisterNetEvent("phone:camera:exit", function()
    setHudDisplay(true)
end)

--- Loops

CreateThread(function()
    while true do
        local player = PlayerPedId()
        local vehicle = GetVehiclePedIsIn(player)

        if LocalPlayer.state.isLoggedIn then
            setHudDisplay(not IsPauseMenuActive())
            setPlayerData({health = GetEntityHealth(player)})
            TriggerEvent("zkea:client:setmap", PlayerHaveHouseMap)

            if IsPedInAnyVehicle(player) and not IsThisModelABicycle(vehicle) then
                local haveLight, lightsOn, highBeamsOn = GetVehicleLightsState(vehicle)

                PlayerInVehicle = true
                setHudRadar(true)
                setVehicleData({
                    speed = math.ceil(GetEntitySpeed(vehicle) * Config.SpeedMultiplier),
                    fuel = GetVehicleFuelLevel(vehicle),
                    engine = GetVehicleEngineHealth(vehicle),
                    lock = GetVehicleDoorLockStatus(vehicle),
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
