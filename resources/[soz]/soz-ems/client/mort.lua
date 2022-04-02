local hold = 5

local function OnDeath()
    if not IsDead then
        IsDead = true
        local player = PlayerPedId()

        while GetEntitySpeed(player) > 0.5 or IsPedRagdoll(player) do
            Wait(10)
        end

        if IsDead then
            local pos = GetEntityCoords(player)
            local heading = GetEntityHeading(player)

            local ped = PlayerPedId()

            if IsPedInAnyVehicle(ped) then
                local veh = GetVehiclePedIsIn(ped)
                local vehseats = GetVehicleModelNumberOfSeats(GetHashKey(GetEntityModel(veh)))
                for i = -1, vehseats do
                    local occupant = GetPedInVehicleSeat(veh, i)
                    if occupant == ped then
                        NetworkResurrectLocalPlayer(pos.x, pos.y, pos.z + 0.5, heading, true, false)
                        SetPedIntoVehicle(ped, veh, i)
                    end
                end
            else
                NetworkResurrectLocalPlayer(pos.x, pos.y, pos.z + 0.5, heading, true, false)
            end

            SetEntityInvincible(player, true)
            SetEntityHealth(player, GetEntityMaxHealth(player))
            TriggerScreenblurFadeIn()
            StartScreenEffect("DeathFailOut", 0, false)
            local ReasonMort = exports["soz-hud"]:Input("Reason du coma:", 200)
            TriggerServerEvent("lsmc:server:SetMort", ReasonMort)
        end
    end
end

function DeathTimer()
    while IsDead do
        Wait(1000)
        DeathTime = DeathTime - 1
        if IsControlPressed(0, 38) and hold <= 0 and not isInHospitalBed then
            TriggerEvent("soz-ems:client:callems")
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
        if DeathTime <= 0 then
            if IsControlPressed(0, 38) and hold <= 0 and isInHospitalBed then
                TriggerEvent("soz_ems:client:Revive")
                hold = 5
            elseif not isInHospitalBed and IsDead then
                TriggerEvent("soz-ems:client:respawn")
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
                    DrawRect(1.0, 1.0, 2.0, 0.25, 0, 0, 0, 255)
                    DrawRect(1.0, 0.0, 2.0, 0.25, 0, 0, 0, 255)
                    DrawTxt(0.865, 1.44, 1.0, 1.0, 0.6, "~w~ Maintenir ~r~[E] (" .. hold .. " sec.)~w~ pour appeler les services de secours", 255, 255, 255, 255)
                end
            end

            if IsPedInAnyVehicle(ped, false) then
                if not IsEntityPlayingAnim(ped, "veh@low@front_ps@idle_duck", "sit", 3) then
                    TaskPlayAnim(ped, "veh@low@front_ps@idle_duck", "sit", 1.0, 1.0, -1, 1, 0, 0, 0, 0)
                end
            else
                if isInHospitalBed then
                    if not IsEntityPlayingAnim(ped, "dead", "dead_a", 3) then
                        TaskPlayAnim(ped, "dead", "dead_a", 1.0, 1.0, -1, 1, 0, 0, 0, 0)
                    end
                    DrawTxt(0.865, 1.44, 1.0, 1.0, 0.6, "~w~ Maintenir ~r~[E] (" .. hold .. " sec.)~w~ pour vous levez ou attender un médecin", 255, 255, 255,
                            255)
                else
                    if not IsEntityPlayingAnim(ped, "dead", "dead_a", 3) then
                        TaskPlayAnim(ped, "dead", "dead_a", 1.0, 1.0, -1, 1, 0, 0, 0, 0)
                    end
                end
            end

            SetCurrentPedWeapon(ped, WEAPON_UNARMED, true)
        end
        Wait(sleep)
    end
end)

RegisterNetEvent("lsmc:client:ShowReasonMort", function(ReasonMort)
    exports["soz-hud"]:DrawAdvancedNotification("LSMC", "Reason du coma", ReasonMort)
end)
