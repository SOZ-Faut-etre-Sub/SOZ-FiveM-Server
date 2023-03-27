local lastPong = GetGameTimer()
local interfaceCrashed, alertDisplayed = false, false

local function AlertPlayer()
    if alertDisplayed then
        return
    end

    Citizen.CreateThread(function()
        while interfaceCrashed do
            QBCore.Functions.DrawText(0.315, 0.01, 0, 0, 1.0, 244, 43, 29, 255, "Perte de communication avec les interfaces...")
            QBCore.Functions.DrawText(0.355, 0.07, 0, 0, 0.5, 255, 255, 255, 255, "Ton installation de FiveM ne supporte pas la charge des interfaces...")
            QBCore.Functions.DrawText(0.378, 0.1, 0, 0, 0.5, 255, 255, 255, 255, "Réduis tes paramètres graphiques, et redémarre ton jeu.")

            Citizen.Wait(0)
        end
        alertDisplayed = false
    end)
end

RegisterNUICallback("pong", function(data, cb)
    if data.data == "pong" then
        lastPong = GetGameTimer()
    end
    cb("ok")
end)

Citizen.CreateThread(function()
    while true do
        SendNUIMessage({action = "ping"})

        Citizen.Wait(1000)

        if GetGameTimer() - lastPong > 5000 then
            interfaceCrashed = true
            AlertPlayer()
        else
            interfaceCrashed = false
        end

        Citizen.Wait(0)
    end
end)
