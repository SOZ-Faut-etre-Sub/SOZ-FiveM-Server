Rhume = false

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
        Random = math.random(1,100)
        if not IsDead then
            if Random == 1 then
                Rhume = false
            end
        end
    end
end)

-- effet maladie

CreateThread(function()
    while true do
        local ped = PlayerPedId()
        Wait(5000)
        if Rhume then
            loadAnimDict("amb@code_human_wander_idles_fat@female@idle_a")
            TaskPlayAnim(ped, "amb@code_human_wander_idles_fat@female@idle_a", "idle_b_sneeze", 1.0, 1.0, -1, 1, 0, 0, 0, 0)
            TriggerScreenblurFadeIn(100)
            Wait(1500)
            TriggerScreenblurFadeOut(100)
            TriggerEvent("animations:client:EmoteCommandStart", {"point"})
            TriggerEvent("animations:client:EmoteCommandStart", {"c"})
        end
    end
end)

--- item

RegisterNetEvent("lsmc:client:mouchoir")
AddEventHandler("lsmc:client:mouchoir", function()
    Rhume = false
    TriggerServerEvent("lsmc:server:remove", "mouchoir")
end)