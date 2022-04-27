local QBCore = exports["qb-core"]:GetCoreObject()
local housingmap = false
local isshown = false
local CurrentHousing = nil

RegisterNetEvent("QBCore:Player:SetPlayerData", function(PlayerData)
    housingmap = false
    for _, item in pairs(PlayerData.items or {}) do
        if item.name == "house_map" then
            housingmap = true
        end
    end
end)

RegisterNetEvent("soz-housing:client:SetAvailableHousing")
AddEventHandler("soz-housing:client:SetAvailableHousing", function(AvailableHousing)
    CurrentHousing = AvailableHousing
end)

RegisterNetEvent("soz-housing:client:ShowBlip")
AddEventHandler("soz-housing:client:ShowBlip", function()
    if isshown then
        TriggerServerEvent("soz-housing:server:GetAvailableHousing")
        Wait(100)
        for item, zone in pairs(CurrentHousing) do
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
    if not isshown then
        for item, zone in pairs(CurrentHousing) do
            if zone.entry_zone ~= nil then
                QBCore.Functions.RemoveBlip(zone.identifier)
            end
        end
    end
end)

CreateThread(function()
    while true do
        if not isshown and housingmap then
            isshown = true
            TriggerEvent("soz-housing:client:ShowBlip")
        end
        if isshown and not housingmap then
            isshown = false
            TriggerEvent("soz-housing:client:ShowBlip")
        end
        Wait(1000)
    end
end)
