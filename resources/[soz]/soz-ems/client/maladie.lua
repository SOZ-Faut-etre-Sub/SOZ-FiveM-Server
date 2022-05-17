-- maladie
Rhume = false
Grippe = false
Dos = false
Rougeur = false
Intoxication = false

-- organe

Foie = false
Poumon = false
Rein = false

RegisterNetEvent("QBCore:Client:OnPlayerLoaded", function()
    TriggerServerEvent("lsmc:server:GetMaladie")
    TriggerServerEvent("lsmc:server:GetOrgane")
end)

RegisterNetEvent("lsmc:maladie:ClearDisease", function(val)
    Rhume = false
    Grippe = false
    Dos = false
    Rougeur = false
    Intoxication = false

    ClearPedTasks()
    TriggerScreenblurFadeOut()
end)

RegisterNetEvent("lsmc:client:SetMaladie", function(maladie, val)
    if maladie == "rhume" then
        if Rhume ~= val then
            if val then
                TriggerEvent("hud:client:DrawNotification", string.format("Vous avez attrapé un rhume, utilisez un mouchoir !"))
            else
                TriggerEvent("hud:client:DrawNotification", string.format("Vous vous sentez mieux !"))
            end
        end

        Rhume = val
    elseif maladie == "grippe" then
        if Grippe ~= val then
            if val then
                TriggerEvent("hud:client:DrawNotification", string.format("Vous avez attrapé la grippe, allez voir un medecin !"))
            else
                TriggerEvent("hud:client:DrawNotification", string.format("Vous vous sentez mieux !"))
            end
        end

        Grippe = val
    elseif maladie == "rougeur" then
        Rougeur = val
    elseif maladie == "intoxication" then
        if Intoxication ~= val then
            if val then
                TriggerEvent("hud:client:DrawNotification", string.format("Vous avez mal au ventre, prenez un antibiotique !"))
            else
                TriggerEvent("hud:client:DrawNotification", string.format("Vous n'avez plus mal au ventre !"))
            end
        end

        Intoxication = val
    elseif maladie == "foie" then
        Foie = val
    elseif maladie == "poumon" then
        if Poumon ~= val then
            if val then
                TriggerEvent("hud:client:DrawNotification", string.format("Vous avez mal du mal à respirer, impossible de courir !"))
            else
                TriggerEvent("hud:client:DrawNotification", string.format("Vous respirez à nouveau, vous êtes prêt pour un marathon !"))
            end
        end

        Poumon = val
    elseif maladie == "rein" then
        Rein = val
    end
end)

local function loadAnimDict(dict)
    while (not HasAnimDictLoaded(dict)) do
        RequestAnimDict(dict)
        Wait(5)
    end
end

-- set effet

CreateThread(function()
    while true do
        Wait(1000 * 60 * 15)
        if LocalPlayer.state.isLoggedIn then
            Random = math.random(1, 1000)
            if not IsDead and not PlayerData.metadata.godmode then
                -- maladie
                if Random == 1 then
                    TriggerServerEvent("lsmc:server:SetMaladie", "rhume", true)
                    Rhume = true
                end
                if Random == 10 then
                    TriggerServerEvent("lsmc:server:SetMaladie", "grippe", true)
                    Grippe = true
                end
                if Random == 20 then
                    TriggerServerEvent("lsmc:server:SetMaladie", "rougeur", true)
                    Rougeur = true
                end
            end
        end
    end
end)

-- effet

CreateThread(function()
    while true do
        local ped = PlayerPedId()
        Wait(15000)
        -- maladie
        if Rhume then
            loadAnimDict("amb@code_human_wander_idles_fat@female@idle_a")
            TaskPlayAnim(ped, "amb@code_human_wander_idles_fat@female@idle_a", "idle_b_sneeze", 1.0, 1.0, -1, 49, 0, 0, 0, 0)
            TriggerScreenblurFadeIn(100)
            Wait(1500)
            TriggerScreenblurFadeOut(100)
            ClearPedTasks(ped)
        elseif Grippe then
            TriggerScreenblurFadeIn(100)
            local player, distance = QBCore.Functions.GetClosestPlayer()
            local id = GetPlayerServerId(player)
            local propagation = math.random(1, 50)

            if player ~= -1 and distance < 4.5 and propagation == 1 then
                TriggerEvent("hud:client:DrawNotification", string.format("Vous avez contaminé l'un de vos concitoyens !"))
                TriggerServerEvent("lsmc:server:SetOrgane", id, "grippe", true)
            end
        elseif Rougeur then
        elseif Intoxication then
            EnableContolAction(0, 21, false)
            -- organe
        elseif Rein then
            TriggerServerEvent("QBCore:Server:Rein")
        elseif Poumon then
            SetPlayerSprint(ped, false)
        elseif Foie then
            TriggerServerEvent("QBCore:Server:Foie")
        end
    end
end)

--- item

RegisterNetEvent("lsmc:client:mouchoir")
AddEventHandler("lsmc:client:mouchoir", function()
    if Rhume then
        TriggerEvent("hud:client:DrawNotification", string.format("Vous utilisez un mouchoir et vous vous sentez mieux !"))
    else
        TriggerEvent("hud:client:DrawNotification", string.format("Vous utilisez un mouchoir, mais rien ne sort !"))
    end

    TriggerServerEvent("lsmc:server:remove", "tissue")
    Rhume = false
    TriggerServerEvent("lsmc:server:SetMaladie", "rhume", false)
end)

RegisterNetEvent("lsmc:client:antibiotique")
AddEventHandler("lsmc:client:antibiotique", function()
    if Intoxication or Grippe then
        TriggerEvent("hud:client:DrawNotification", string.format("Vous utilisez un antibiotique et vous vous sentez mieux !"))
    else
        TriggerEvent("hud:client:DrawNotification", string.format("Vous utilisez un antibiotique, mais rien ne change !"))
    end

    Intoxication = false
    Grippe = false

    TriggerScreenblurFadeOut(100)
    TriggerServerEvent("lsmc:server:SetMaladie", "intoxication", false)
    TriggerServerEvent("lsmc:server:SetMaladie", "grippe", false)
    TriggerServerEvent("lsmc:server:remove", "antibiotic")
end)
