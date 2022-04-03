AddEventHandler("soz-driving-license:client:start_exam", function(data)
    Citizen.CreateThread(function()
        -- Check if spawn location is free
        local licenseType = data.license
        local vData = Config.Licenses[licenseType].vehicle
        if not vData then
            return
        end

        -- Get free vehicle spawn point
        local spawnPoint = GetSpawnPoint(vData.spawnPoints)
        if not spawnPoint then
            TriggerEvent("hud:client:DrawNotification", "Parking encombré, l'instructeur ne peut pas garer le véhicule d'examen.", "error")
            return
        end

        -- Make player pay
        TriggerServerEvent("soz-driving-license:server:pay", licenseType, spawnPoint)
    end)
end)

RegisterNetEvent("soz-driving-license:client:spawn_vehicle", function(licenseType, spawnPoint)
    SetupDrivingSchoolExam(licenseType, spawnPoint)
end)
