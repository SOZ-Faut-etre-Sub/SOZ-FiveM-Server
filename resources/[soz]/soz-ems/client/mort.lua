local hold = 5

local function OnDeath()
    if not IsDead then
        IsDead = true
        local player = PlayerPedId()

        exports["menuv"]:SendNUIMessage({action = "KEY_CLOSE_ALL"})
        TriggerEvent("soz-core:client:menu:close", false)

        while GetEntitySpeed(player) > 0.5 or IsPedRagdoll(player) do
            Wait(10)
        end

        if IsDead then
            local pos = GetEntityCoords(player)
            local heading = GetEntityHeading(player)

            if IsPedInAnyVehicle(player) then
                local veh = GetVehiclePedIsIn(player)
                local vehseats = GetVehicleModelNumberOfSeats(GetHashKey(GetEntityModel(veh)))
                for i = -1, vehseats do
                    local occupant = GetPedInVehicleSeat(veh, i)
                    if occupant == player then
                        NetworkResurrectLocalPlayer(pos.x, pos.y, pos.z, heading, true, false)
                        SetPedIntoVehicle(player, veh, i)
                    end
                end
            else
                NetworkResurrectLocalPlayer(pos.x, pos.y, pos.z + 0.5, heading, true, false)
            end

            SetEntityInvincible(player, true)
            IsEntityStatic(player, true)
            SetBlockingOfNonTemporaryEvents(player, true)
            SetEntityHealth(player, GetEntityMaxHealth(player))
            TriggerScreenblurFadeIn()
            StartScreenEffect("DeathFailOut", 0, false)

            TriggerEvent("ems:client:onDeath")
            TriggerServerEvent("ems:server:onDeath")
            LocalPlayer.state:set("inv_busy", false, true)

            local ReasonMort = exports["soz-hud"]:Input("Raison du coma :", 200)
            TriggerServerEvent("lsmc:server:SetMort", ReasonMort)
        end
    end
end

function DeathTimer()
    while IsDead do
        Wait(1000)
        DeathTime = DeathTime - 1
        if IsControlPressed(0, 38) and hold <= 0 and not isInHospitalBed then
            Callems = true
            TriggerEvent("soz-ems:client:callems")
            hold = 5
        end
        if Callems == false or isInHospitalBed and IsControlPressed(0, 38) then
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
                TriggerServerEvent("lsmc:server:revive", GetPlayerServerId(PlayerId()))
                hold = 5
            elseif not isInHospitalBed and IsDead then
                TriggerEvent("soz-character:Client:ApplyTemporaryClothSet", Config.PatientClothes[PlayerData.skin.Model.Hash])
                TriggerEvent("soz-ems:client:respawn")
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
        if LocalPlayer.state.isLoggedIn then
            local playerPed = PlayerPedId()
            if IsEntityDead(playerPed) then
                DeathTime = Config.DeathTime
                OnDeath()
                DeathTimer()
            end
        end

        Wait(10)
    end
end)

CreateThread(function()
    while true do
        sleep = 1000
        if IsDead then
            sleep = 0
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
            EnableControlAction(0, 200, true)

            if not isInHospitalBed then
                if DeathTime > 0 then
                    DrawRect(1.0, 1.0, 2.0, 0.25, 0, 0, 0, 255)
                    DrawRect(1.0, 0.0, 2.0, 0.25, 0, 0, 0, 255)
                    if not Callems then
                        DrawTxt(0.865, 1.44, 1.0, 1.0, 0.6, "~w~ Maintenir ~r~[E] (" .. hold .. " sec.)~w~ pour appeler les services de secours", 255, 255, 255,
                                255)
                    else
                        DrawTxt(0.865, 1.44, 1.0, 1.0, 0.6, "Attendez que les services de secours viennent à vous", 255, 255, 255, 255)
                    end
                end
            end

            if IsPedInAnyVehicle(ped, true) then
                if not IsEntityPlayingAnim(ped, "veh@low@front_ps@idle_duck", "sit", 3) then
                    QBCore.Functions.RequestAnimDict("veh@low@front_ps@idle_duck")
                    TaskPlayAnim(ped, "veh@low@front_ps@idle_duck", "sit", 1.0, 1.0, -1, 1, 0, 0, 0, 0)
                end
            else
                if not IsEntityPlayingAnim(ped, "dead", "dead_a", 3) then
                    QBCore.Functions.RequestAnimDict("dead")
                    TaskPlayAnim(ped, "dead", "dead_a", 1.0, 1.0, -1, 1, 0, 0, 0, 0)
                end
                if isInHospitalBed then
                    DrawTxt(0.865, 1.44, 1.0, 1.0, 0.6, "~w~ Maintenir ~r~[E] (" .. hold .. " sec.)~w~ pour vous relever, ou alors attendez un médecin.", 255,
                            255, 255, 255)
                end
            end

            TriggerEvent("inventory:client:StoreWeapon")
        end
        Wait(sleep)
    end
end)
