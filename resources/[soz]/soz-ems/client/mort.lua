hold = 5

local function loadAnimDict(dict)
    while (not HasAnimDictLoaded(dict)) do
        RequestAnimDict(dict)
        Wait(5)
    end
end

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

            loadAnimDict("dead")
            TaskPlayAnim(player, "dead", "dead_a", 1.0, 1.0, -1, 1, 0, 0, 0, 0)
        end
    end
end

function DeathTimer()
    while IsDead do
        Wait(1000)
        DeathTime = DeathTime -1
        if DeathTime <= 0 then
            if IsControlPressed(0, 38) and hold <= 0 and not isInHospitalBed then
                print("should respawn")
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
    SetTextDropShadow(0, 0, 0, 0,255)
    SetTextEdge(2, 0, 0, 0, 255)
    SetTextDropShadow()
    SetTextOutline()
    SetTextEntry("STRING")
    AddTextComponentString(text)
    DrawText(x - width/2, y - height/2 + 0.005)
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
                    DrawTxt(0.93, 1.44, 1.0,1.0,0.6, 'Réapparaître dans : ~r~' .. math.ceil(DeathTime) .. '~w~ secondes', 255, 255, 255, 255)
                else
                    DrawTxt(0.865, 1.44, 1.0, 1.0, 0.6, "~w~ Maintenir ~r~[E] (" .. hold .. " sec.)~w~ pour appeler l'untité X", 255, 255, 255, 255)
                end
            end
            SetCurrentPedWeapon(ped, `WEAPON_UNARMED`, true)
        end
        Wait(sleep)
    end
end)