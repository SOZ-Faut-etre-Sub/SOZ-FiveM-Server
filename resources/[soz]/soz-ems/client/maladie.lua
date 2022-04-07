Activated = true

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

RegisterNetEvent("lsmc:maladie:ActivateDisease", function(val)
    Activated = val
    if val == false then
        Rhume = false
        Grippe = false
        Dos = false
        Rougeur = false
        Intoxication = false

        ClearPedTasks()
        TriggerScreenblurFadeOut()
    end
end)

RegisterNetEvent("lsmc:client:SetMaladie", function(maladie, val)
    if maladie == "Rhume" then
        Rhume = val
    elseif maladie == "Grippe" then
        Grippe = val
    elseif maladie == "Rougeur" then
        Rougeur = val
    elseif maladie == "Intoxication" then
        Intoxication = val
    elseif maladie == "foie" then
        Foie = val
    elseif maladie == "poumon" then
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
        Wait(1000000)
        Random = math.random(1, 1000)
        if not IsDead and Activated then
            -- maladie
            if Random == 1 then
                TriggerServerEvent("lsmc:server:SetMaladie", "Rhume", true)
                Rhume = true
            end
            if Random == 10 then
                TriggerServerEvent("lsmc:server:SetMaladie", "Grippe", true)
                Grippe = true
            end
            if Random == 20 then
                TriggerServerEvent("lsmc:server:SetMaladie", "Rougeur", true)
                Rougeur = true
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
            if player ~= -1 and distance < 5.5 then
                TriggerServerEvent("lsmc:server:SetOrgane", id, "grippe", true)
            end
        elseif Rougeur then
        elseif Intoxication then
            EnableContolAction(0, 21, false)
            -- organe
        elseif Rein then
            TriggerServerEvent("QBCore:Server:Rein")
        elseif Poumon then
            EnableContolAction(0, 21, false)
        elseif Foie then
            TriggerServerEvent("QBCore:Server:Foie")
        end
    end
end)

--- item

RegisterNetEvent("lsmc:client:mouchoir")
AddEventHandler("lsmc:client:mouchoir", function()
    Rhume = false
    TriggerServerEvent("lsmc:server:SetMaladie", "rhume", false)
    TriggerServerEvent("lsmc:server:remove", "mouchoir")
end)

RegisterNetEvent("lsmc:client:antibiotique")
AddEventHandler("lsmc:client:antibiotique", function()
    Intoxication = false
    TriggerScreenblurFadeOut(100)
    TriggerServerEvent("lsmc:server:SetMaladie", "intoxication", false)
    TriggerServerEvent("lsmc:server:remove", "antibiotique")
end)
