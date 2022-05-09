local QBCore = exports["qb-core"]:GetCoreObject()
local housingmap = false
local AvailableHousing = nil

local function SyncBlips(OldAvailableHousing, NewOldAvailableHousing)
    for _, zone in pairs(OldAvailableHousing) do
        if zone.entry_zone ~= nil then
            QBCore.Functions.RemoveBlip(zone.identifier)
        end
    end

    for _, zone in pairs(NewOldAvailableHousing) do
        if zone.entry_zone ~= nil then
            point = json.decode(zone.entry_zone)
            QBCore.Functions.CreateBlip(zone.identifier,
                                        {
                name = "Habitation",
                coords = vector3(point.x, point.y, point.z),
                sprite = 350,
                color = 5,
                scale = 0.5,
            })
        end
    end
end

Citizen.CreateThread(function()
    AvailableHousing = QBCore.Functions.TriggerRpc("soz-housing:server:GetAvailableHousing")
end)

RegisterNetEvent("soz-housing:client:SyncAvailableHousing")
AddEventHandler("soz-housing:client:SyncAvailableHousing", function(data)
    if housingmap then
        SyncBlips(AvailableHousing, data)
    end

    AvailableHousing = data
end)

RegisterNetEvent("QBCore:Player:SetPlayerData", function(PlayerData)
    local oldHousingMap = housingmap
    housingmap = false

    for _, item in pairs(PlayerData.items or {}) do
        if item.name == "house_map" then
            housingmap = true
        end
    end

    if oldHousingMap ~= housingmap then
        if housingmap then
            SyncBlips({}, AvailableHousing)
        else
            SyncBlips(AvailableHousing, {})
        end
    end
end)
