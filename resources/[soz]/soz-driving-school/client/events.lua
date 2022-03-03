local QBCore = exports["qb-core"]:GetCoreObject()

WarnedNoGps = false -- This value is reset on exam.TerminateExam()
local function playerHasGps()
    local PlayerData = QBCore.Functions.GetPlayerData() or {}
    for _, item in pairs(PlayerData.items) do
        if item.name == "gps" then
            return true
        end
    end
    return false
end

AddEventHandler("soz-driving-license:client:start_exam", function(data)
    Citizen.CreateThread(function()
        -- Check if spawn location is free
        local licenseType = data.license
        local vData = Config.Licenses[licenseType].vehicle
        if not vData then
            return
        end

        -- Check if player has a GPS
        local hasGps = playerHasGps()
        if not hasGps and not WarnedNoGps then
            WarnedNoGps = true
            exports["soz-hud"]:DrawNotification("Un GPS est fortement recommandé pour le passage du permis. L'hôtesse d'accueil peut vous en vendre un.",
                                                false, Config.NotificationDelay)
            return
        end

        -- Check if vehicle spawn point free
        if not IsSpawnPointFree(vData.x, vData.y, vData.z) then
            TriggerEvent("hud:client:DrawNotification", "~r~Parking encombré, l'instructeur ne peut pas garer le véhicule d'examen.")
            return
        end

        -- Make player pay
        TriggerServerEvent("soz-driving-license:server:pay", licenseType)
    end)
end)

RegisterNetEvent("soz-driving-license:client:spawn_vehicle", function(licenseType)
    SetupDrivingSchoolExam(licenseType)
end)

--
-- NUI related events
--
AddEventHandler("soz-driving-school:client:request-nui-data", function(target)
    TriggerServerEvent("soz-driving-school:server:show-license", target)
end)

RegisterNetEvent("soz-driving-school:client:show-licence", function(data)
    SendNUIMessage(data)
end)

AddEventHandler("soz-driving-school:client:hide-license", function()
    SendNUIMessage({type = "hide"})
end)
