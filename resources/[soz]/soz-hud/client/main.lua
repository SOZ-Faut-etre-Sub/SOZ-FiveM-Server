local QBCore = exports['qb-core']:GetCoreObject()

local HudDisplayed, HudRadar = false, true
--- @class PlayerData
local HudPlayerStatus = {
    --- @type number
    hunger = 100,
    --- @type number
    thirst = 100
}

--- Update Functions

--- Global Hud display function
--- @param state boolean
local function setHudDisplay(state)
    if HudDisplayed ~= state then
        HudDisplayed = state
        SendNUIMessage({ action = 'display', show = HudDisplayed })
    end
end

--- Radar Hud display function
--- @param state boolean
local function setHudRadar(state)
    if HudRadar ~= state then
        HudRadar = state
        DisplayRadar(HudRadar)
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
        SendNUIMessage({ action = 'update_needs', hunger = data.hunger, thirst = data.thirst })
    end
end

--- Events

--- Populate value at player login
RegisterNetEvent('QBCore:Client:OnPlayerLoaded', function()
    setHudDisplay(true)
    QBCore.Functions.GetPlayerData(function(PlayerData)
        HudPlayerStatus.hunger = PlayerData.metadata['hunger']
        HudPlayerStatus.thirst = PlayerData.metadata['thirst']
    end)
end)

RegisterNetEvent('QBCore:Client:OnPlayerUnload', function()
    setHudDisplay(false)
end)

--- Keep same name as qb-hud
RegisterNetEvent('hud:client:UpdateNeeds', function(newHunger, newThirst)
    setPlayerData({ hunger = newHunger, thirst = newThirst })
end)

--- Loops

CreateThread(function()
    while true do
        local player = PlayerPedId()
        local vehicle = GetVehiclePedIsIn(player)

        if LocalPlayer.state.isLoggedIn then
            setHudDisplay(not IsPauseMenuActive())
            setHudRadar(IsPedInAnyVehicle(player) and not IsThisModelABicycle(vehicle))
        else
            Wait(500)
        end

        Wait(50)
    end
end)
