local DiseaseLoop = false

local function loadAnimDict(dict)
    while (not HasAnimDictLoaded(dict)) do
        RequestAnimDict(dict)
        Wait(5)
    end
end

RegisterNetEvent("lsmc:maladie:client:ApplyCurrentDiseaseEffect", function(disease)
    if disease == false then
        -- clean
        TriggerScreenblurFadeOut(100)
        ClearPedTasks(ped)
        DiseaseLoop = false

        return
    end

    -- Has already a disease do not continue
    if DiseaseLoop then
        return
    end

    if disease == "rhume" then
        DiseaseLoop = true

        exports["soz-hud"]:DrawNotification("Vous avez un petit rhume")

        Citizen.CreateThread(function()
            while DiseaseLoop do
                loadAnimDict("amb@code_human_wander_idles_fat@female@idle_a")
                TaskPlayAnim(PlayerPedId(), "amb@code_human_wander_idles_fat@female@idle_a", "idle_b_sneeze", 1.0, 1.0, -1, 48, 0, 0, 0, 0)
                TriggerScreenblurFadeIn(100)
                Wait(1800)
                TriggerScreenblurFadeOut(100)
                ClearPedTasks()

                Wait(10 * 1000)
            end
        end)
    end

    if disease == "grippe" then
        DiseaseLoop = true
        TriggerScreenblurFadeIn(100)

        exports["soz-hud"]:DrawNotification("Vous avez la grippe")

        Citizen.CreateThread(function()
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
    if disease == "backpain" then
        DiseaseLoop = true

        exports["soz-hud"]:DrawNotification("Vous avez mal au dos")

        Citizen.CreateThread(function()
            while DiseaseLoop do
                DisableControlAction(0, 21, true) -- disable sprint
                DisableControlAction(0, 22, true) -- disable jump
                Wait(5)
            end
        end)
    end

    if disease == "intoxication" then
        DiseaseLoop = true

        exports["soz-hud"]:DrawNotification("Vous avez digéré un truc pas frais.")

        Citizen.CreateThread(function()
            while DiseaseLoop do
                loadAnimDict("random@drunk_driver_1")
                TaskPlayAnim(PlayerPedId(), "random@drunk_driver_1", "vomit_outside", 1.0, 1.0, -1, 16, 0, 0, 0, 0)
                Wait(1500)
                ClearPedTasks()
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
        SetPlayerSprint(ped, true)
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
            local pollutionLevel = exports["soz-upw"]:GetPollutionLevel()
            local max = Config.DiseaseRange[pollutionLevel] or 1000

            Random = math.random(1, max)

            if not IsDead and not PlayerData.metadata.godmode then
                -- maladie
                if Random == 1 then
                    TriggerServerEvent("lsmc:maladie:server:SetCurrentDisease", "rhume")
                end

                if Random == 10 then
                    TriggerServerEvent("lsmc:maladie:server:SetCurrentDisease", "grippe")
                end
            end
        end
    end
end)
