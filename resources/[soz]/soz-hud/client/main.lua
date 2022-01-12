local QBCore = exports["qb-core"]:GetCoreObject()

local HudForcedStateDisplay = true
HudDisplayed, HudRadar = false, true
--- @class PlayerData
local HudPlayerStatus = {
    --- @type number
    hunger = 100,
    --- @type number
    thirst = 100,
}
--- @class VehicleData
local HudVehicleStatus = {
    --- @type boolean
    haveSeatbelt = false,
    --- @type number
    speed = 0,
    --- @type number
    fuel = 100,
    --- @type boolean
    haveLight = false,
    --- @type boolean
    lightsOn = false,
    --- @type boolean
    highBeamsOn = false,
}

--- Update Functions

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
        DisplayRadar(HudRadar)
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
        SendNUIMessage({action = "update_needs", hunger = data.hunger, thirst = data.thirst})
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
            haveSeatbelt = HudVehicleStatus.haveSeatbelt,
            haveLight = HudVehicleStatus.haveLight,
            lightsOn = HudVehicleStatus.lightsOn,
            highBeamsOn = HudVehicleStatus.highBeamsOn,
        })
    end
end

--- Events

--- Populate value at player login
RegisterNetEvent("QBCore:Client:OnPlayerLoaded", function()
    ForceCloseTextInputBox() -- Ensure last input is closed
    setHudDisplay(true)
    QBCore.Functions.GetPlayerData(function(PlayerData)
        HudPlayerStatus.hunger = PlayerData.metadata["hunger"]
        HudPlayerStatus.thirst = PlayerData.metadata["thirst"]
    end)
end)

RegisterNetEvent("QBCore:Client:OnPlayerUnload", function()
    setHudDisplay(false)
end)

--- Keep same name as qb-hud
RegisterNetEvent("hud:client:UpdateNeeds", function(newHunger, newThirst)
    setPlayerData({hunger = newHunger, thirst = newThirst})
end)

RegisterNetEvent("hud:client:UpdateSeatbelt", function(newState)
    setVehicleData({haveSeatbelt = newState})
end)

RegisterNetEvent("hud:client:OverrideVisibility", function(newState)
    HudForcedStateDisplay = newState
    setHudDisplay(newState)
end)

--- Loops

CreateThread(function()
    while true do
        local player = PlayerPedId()
        local vehicle = GetVehiclePedIsIn(player)

        if LocalPlayer.state.isLoggedIn then
            setHudDisplay(not IsPauseMenuActive())

            if IsPedInAnyVehicle(player) and not IsThisModelABicycle(vehicle) then
                local haveLight, lightsOn, highBeamsOn = GetVehicleLightsState(vehicle)

                setHudRadar(true)
                setVehicleData({
                    speed = math.ceil(GetEntitySpeed(vehicle) * Config.SpeedMultiplier),
                    fuel = GetVehicleFuelLevel(vehicle),
                    haveLight = haveLight,
                    lightsOn = lightsOn,
                    highBeamsOn = highBeamsOn,
                })
            else
                setHudRadar(false)
            end
        else
            Wait(500)
        end

        Wait(50)
    end
end)
