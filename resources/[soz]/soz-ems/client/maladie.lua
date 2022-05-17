local DiseaseLoop = false



local function loadAnimDict(dict)
    while (not HasAnimDictLoaded(dict)) do
        RequestAnimDict(dict)
        Wait(5)
    end
end

RegisterNetEvent("lsmc:maladie:client:ApplyCurrentDiseaseEffect", function(disease)
    if not disease then
        -- clean
        TriggerScreenblurFadeOut(100)
        ClearPedTasks(ped)
        DiseaseLoop = false

        return
    end

    if disease == "rhume" then
        DiseaseLoop = true

        Citizen.CreateThead(function ()
            while DiseaseLoop do
                loadAnimDict("amb@code_human_wander_idles_fat@female@idle_a")
                TaskPlayAnim(ped, "amb@code_human_wander_idles_fat@female@idle_a", "idle_b_sneeze", 1.0, 1.0, -1, 49, 0, 0, 0, 0)
                TriggerScreenblurFadeIn(100)
                Wait(1500)
                TriggerScreenblurFadeOut(100)
                ClearPedTasks()

                Wait(10000)
            end
        end)
    end

    if disease == "grippe" then
        DiseaseLoop = true
        TriggerScreenblurFadeIn(100)

        Citizen.CreateThead(function ()
            while DiseaseLoop do
                local player, distance = QBCore.Functions.GetClosestPlayer()
                local id = GetPlayerServerId(player)
                local propagation = math.random(1, 5)

                if player ~= -1 and distance < 4.5 and propagation == 1 then
                    TriggerServerEvent("lsmc:maladie:server:SetCurrentDisease", "grippe", id)
                end

                Wait(60 * 1000)
            end
        end)
    end
end)

local function has_value(tab, val)
    for index, value in ipairs(tab) do
        if value == val then
            return true
        end
    end

    return false
end

RegisterNetEvent("lsmc:maladie:client:ApplyConditions", function(conditions)
    local ped = PlayerPedId()
    conditions = conditions or {}

    if has_value(conditions, Config.ConditionType.NoRun) then
        SetPlayerSprint(ped, false)
    else
        SetPlayerSprint(ped, false)
    end

    if has_value(conditions, Config.ConditionType.NoHair) then
        -- SetPlayerSprint(ped, false)
    end
end)

-- set effet

CreateThread(function()
    while true do
        Wait(1000 * 60 * 15)
        if LocalPlayer.state.isLoggedIn then
            Random = math.random(1, 1000)
            if not IsDead and not PlayerData.metadata.godmode then
                -- maladie
                if Random == 1 then
                    TriggerServerEvent("lsmc:maladie:server:SetCurrentDisease", "rhume")
                end

                if Random == 10 then
                    TriggerServerEvent("lsmc:maladie:server:SetCurrentDisease", "grippe")
                end

                if Random == 20 then
                    TriggerServerEvent("lsmc:maladie:server:SetCurrentDisease", "rougeur")
                end
            end
        end
    end
end)
--- item

RegisterNetEvent("lsmc:client:mouchoir")
AddEventHandler("lsmc:client:mouchoir", function()

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
