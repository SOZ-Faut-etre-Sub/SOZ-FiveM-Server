Rhume = false
Grippe = false
Dos = false
Rougeur = false
Intoxication = false

local function loadAnimDict(dict)
    while (not HasAnimDictLoaded(dict)) do
        RequestAnimDict(dict)
        Wait(5)
    end
end

-- set maladie

CreateThread(function()
    while true do
        Wait(10000)
        Random = math.random(1, 1000)
        if not IsDead then
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
            if Random == 30 then
                TriggerServerEvent("lsmc:server:SetMaladie", "intoxication", true)
                Intoxication = true
            end
        end
    end
end)

-- effet maladie

CreateThread(function()
    while true do
        local ped = PlayerPedId()
        Wait(15000)
        if Rhume then
            loadAnimDict("amb@code_human_wander_idles_fat@female@idle_a")
            TaskPlayAnim(ped, "amb@code_human_wander_idles_fat@female@idle_a", "idle_b_sneeze", 1.0, 1.0, -1, 1, 0, 0, 0, 0)
            TriggerScreenblurFadeIn(100)
            Wait(1500)
            TriggerScreenblurFadeOut(100)
            ClearPedTasks(ped)
        end
        if Grippe then
            
        end
        if Dos then

        end
        if Rougeur then

        end
        if Intoxication then

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
