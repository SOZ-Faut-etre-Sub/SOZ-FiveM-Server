local hold = 5

local function OnDeath()
    if not IsDead then
        IsDead = true
        local player = PlayerPedId()

        while GetEntitySpeed(player) > 0.5 or IsPedRagdoll(player) do
            Wait(10)
        end

        if IsDead then
            local position = GetEntityCoords(player)
            local heading = GetEntityHeading(player)

            local ped = PlayerPedId()

            SetEntityInvincible(player, true)
            SetEntityHealth(player, GetEntityMaxHealth(player))

            TaskPlayAnim(player, "dead", "dead_a", 1.0, 1.0, -1, 1, 0, 0, 0, 0)
        end
    end
end

function DeathTimer()
    while IsDead do
        Wait(1000)
        DeathTime = DeathTime - 1
        if DeathTime <= 0 then
            if IsControlPressed(0, 38) and hold <= 0 and not isInHospitalBed then
                TriggerEvent("soz-ems:client:respawn")
                hold = 5
            end
            if IsControlPressed(0, 38) and hold <= 0 and isInHospitalBed then
                TriggerEvent("soz_ems:client:Revive")
                hold = 5
            end
            if IsControlPressed(0, 38) then
                if hold - 1 >= 0 then
                    hold = hold - 1
                else
                    hold = 0
                end
            end
            if IsControlReleased(0, 38) then
                hold = 5
            end
        end
    end
end

local function DrawTxt(x, y, width, height, scale, text, r, g, b, a, outline)
    SetTextFont(4)
    SetTextProportional(0)
    SetTextScale(scale, scale)
    SetTextColour(r, g, b, a)
    SetTextDropShadow(0, 0, 0, 0, 255)
    SetTextEdge(2, 0, 0, 0, 255)
    SetTextDropShadow()
    SetTextOutline()
    SetTextEntry("STRING")
    AddTextComponentString(text)
    DrawText(x - width / 2, y - height / 2 + 0.005)
end

CreateThread(function()
    while true do
        Wait(10)
        local player = PlayerId()
        if NetworkIsPlayerActive(player) then
            local playerPed = PlayerPedId()
            if IsEntityDead(playerPed) then
                DeathTime = Config.DeathTime
                OnDeath()
                DeathTimer()
            end
        end
    end
end)

CreateThread(function()
    while true do
        sleep = 1000
        if IsDead then
            sleep = 5
            local ped = PlayerPedId()
            DisableAllControlActions(0)
            EnableControlAction(0, 1, true)
            EnableControlAction(0, 2, true)
            EnableControlAction(0, 245, true)
            EnableControlAction(0, 38, true)
            EnableControlAction(0, 0, true)
            EnableControlAction(0, 322, true)
            EnableControlAction(0, 288, true)
            EnableControlAction(0, 213, true)
            EnableControlAction(0, 249, true)
            EnableControlAction(0, 46, true)

            if not isInHospitalBed then
                if DeathTime > 0 then
                    DrawTxt(0.93, 1.44, 1.0, 1.0, 0.6, "Mort: ~r~" .. math.ceil(DeathTime) .. "~w~ secondes restant", 255, 255, 255, 255)
                else
                    DrawTxt(0.865, 1.44, 1.0, 1.0, 0.6, "~w~ Maintenir ~r~[E] (" .. hold .. " sec.)~w~ pour appeler l'untité X", 255, 255, 255, 255)
                end
            end

            if IsPedInAnyVehicle(ped, false) then
                if not IsEntityPlayingAnim(ped, "veh@low@front_ps@idle_duck", "sit", 3) then
                    TaskPlayAnim(ped, "veh@low@front_ps@idle_duck", "sit", 1.0, 1.0, -1, 1, 0, 0, 0, 0)
                end
            else
                if isInHospitalBed then
                    if not IsEntityPlayingAnim(ped, "anim@gangops@morgue@table@", "body_search", 3) then
                        TaskPlayAnim(ped, "anim@gangops@morgue@table@", "body_search", 1.0, 1.0, -1, 1, 0, 0, 0, 0)
                    end
                    DrawTxt(0.865, 1.44, 1.0, 1.0, 0.6, "~w~ Maintenir ~r~[E] (" .. hold .. " sec.)~w~ pour vous levez ou attender un médecin", 255, 255, 255,
                            255)
                end
            end

            SetCurrentPedWeapon(ped, WEAPON_UNARMED, true)
        end
        Wait(sleep)
    end
end)
