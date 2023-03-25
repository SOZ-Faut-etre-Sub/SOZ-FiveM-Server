PoliceJob.Animations = {}

RegisterNetEvent("police:client:HandCuffAnimation", function()
    local ped = PlayerPedId()
    local lib = "mp_arrest_paired"

    TriggerServerEvent("InteractSound_SV:PlayOnSource", LocalPlayer.state.isHandcuffed and "Cuff" or "Uncuff", 0.2)
    QBCore.Functions.RequestAnimDict(lib)

    Wait(100)
    TaskPlayAnim(ped, lib, "cop_p2_back_right", 3.0, 3.0, -1, 48, 0, 0, 0, 0)
    TriggerServerEvent("InteractSound_SV:PlayOnSource", "Cuff", 0.2)

    Wait(3500)
    TaskPlayAnim(ped, lib, "exit", 3.0, 3.0, -1, 48, 0, 0, 0, 0)
end)

RegisterNetEvent("police:client:UnCuffAnimation", function()
    local ped = PlayerPedId()
    local lib = "mp_arresting"

    QBCore.Functions.RequestAnimDict(lib)
    TaskPlayAnim(ped, lib, "a_uncuff", 8.0, -8.0, 3000, 48, 0, 0, 0, 0)
end)

RegisterNetEvent("police:client:RedCall", function(societyNumber, msg)
    QBCore.Functions.Progressbar("job:police:red-call", "Code rouge en cours ...", 5000, true, true,
                                 {
        disableMovement = true,
        disableCarMovement = true,
        disableMouse = false,
        disableCombat = true,
    }, {animDict = "oddjobs@assassinate@guard", anim = "unarmed_earpiece_a", flags = 48}, {}, {}, function() -- Done
        TriggerServerEvent("phone:sendSocietyMessage", "phone:sendSocietyMessage:" .. QBCore.Shared.UuidV4(),
                           {anonymous = false, number = societyNumber, message = msg, position = true})
    end)
end)

PoliceJob.Animations.GetCuffed = function(playerId)
    local ped = PlayerPedId()
    local lib = "mp_arrest_paired"
    local cuffer = GetPlayerPed(GetPlayerFromServerId(playerId))
    local heading = GetEntityHeading(cuffer)

    TriggerServerEvent("InteractSound_SV:PlayOnSource", "Cuff", 0.2)

    QBCore.Functions.RequestAnimDict(lib)
    SetEntityCoords(ped, GetOffsetFromEntityInWorldCoords(cuffer, 0.0, 0.45, 0.0))
    Wait(100)
    SetEntityHeading(ped, heading)
    TaskPlayAnim(ped, lib, "crook_p2_back_right", 3.0, 3.0, -1, 32, 0, 0, 0, 0, true, true, true)
    Wait(2500)
end

--- Loops
CreateThread(function()
    while true do
        Wait(1)

        if LocalPlayer.state.isLoggedIn then
            if LocalPlayer.state.isEscorted or PlayerData.metadata["ishandcuffed"] then
                DisableAllControlActions(0)

                --- Camera
                EnableControlAction(0, 1, true)
                EnableControlAction(0, 2, true)

                --- Push to talk
                EnableControlAction(0, 249, true)
                EnableControlAction(0, 46, true)
            end

            if PlayerData.metadata["ishandcuffed"] then
                --- Movement
                EnableControlAction(0, 30, true)
                EnableControlAction(0, 31, true)

                --- Vehicle enter
                EnableControlAction(0, 23, true)
                EnableControlAction(0, 75, true)

                if (not IsEntityPlayingAnim(PlayerPedId(), "mp_arresting", "idle", 3) and
                    not IsEntityPlayingAnim(PlayerPedId(), "mp_arrest_paired", "crook_p2_back_right", 3)) and not PlayerData.metadata["isdead"] then
                    QBCore.Functions.RequestAnimDict("mp_arresting")
                    TaskPlayAnim(PlayerPedId(), "mp_arresting", "idle", 8.0, -8, -1, 49, 0, 0, 0, 0)
                end
            end

            if not PlayerData.metadata["ishandcuffed"] and not LocalPlayer.state.isEscorted then
                Wait(2000)
            end
        end
    end
end)
