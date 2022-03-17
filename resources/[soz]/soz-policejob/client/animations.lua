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
            if LocalPlayer.state.isEscorted then
                DisableAllControlActions(0)
                EnableControlAction(0, 1, true)
                EnableControlAction(0, 2, true)
                EnableControlAction(0, 245, true)
                EnableControlAction(0, 38, true)
                EnableControlAction(0, 322, true)
                EnableControlAction(0, 249, true)
                EnableControlAction(0, 46, true)
            end

            if PlayerData.metadata["ishandcuffed"] then
                DisableControlAction(0, 24, true) -- Attack
                DisableControlAction(0, 257, true) -- Attack 2
                DisableControlAction(0, 25, true) -- Aim
                DisableControlAction(0, 263, true) -- Melee Attack 1

                DisableControlAction(0, 45, true) -- Reload
                DisableControlAction(0, 22, true) -- Jump
                DisableControlAction(0, 44, true) -- Cover
                DisableControlAction(0, 37, true) -- Select Weapon
                DisableControlAction(0, 23, true) -- Also 'enter'?

                DisableControlAction(0, 288, true) -- Disable phone
                DisableControlAction(0, 289, true) -- Inventory
                DisableControlAction(0, 170, true) -- Animations
                DisableControlAction(0, 167, true) -- Job

                DisableControlAction(0, 26, true) -- Disable looking behind
                DisableControlAction(0, 73, true) -- Disable clearing animation
                DisableControlAction(2, 199, true) -- Disable pause screen

                DisableControlAction(0, 59, true) -- Disable steering in vehicle
                DisableControlAction(0, 71, true) -- Disable driving forward in vehicle
                DisableControlAction(0, 72, true) -- Disable reversing in vehicle

                DisableControlAction(2, 36, true) -- Disable going stealth

                DisableControlAction(0, 264, true) -- Disable melee
                DisableControlAction(0, 257, true) -- Disable melee
                DisableControlAction(0, 140, true) -- Disable melee
                DisableControlAction(0, 141, true) -- Disable melee
                DisableControlAction(0, 142, true) -- Disable melee
                DisableControlAction(0, 143, true) -- Disable melee
                DisableControlAction(0, 75, true) -- Disable exit vehicle
                DisableControlAction(27, 75, true) -- Disable exit vehicle
                EnableControlAction(0, 249, true) -- Added for talking while cuffed
                EnableControlAction(0, 46, true) -- Added for talking while cuffed

                if (not IsEntityPlayingAnim(PlayerPedId(), "mp_arresting", "idle", 3) and
                    not IsEntityPlayingAnim(PlayerPedId(), "mp_arrest_paired", "crook_p2_back_right", 3)) and not PlayerData.metadata["isdead"] then
                    QBCore.Functions.RequestAnimDict("mp_arresting")
                    TaskPlayAnim(PlayerPedId(), "mp_arresting", "idle", 8.0, -8, -1, 1, 0, 0, 0, 0)
                end
            end

            if not PlayerData.metadata["ishandcuffed"] and not LocalPlayer.state.isEscorted then
                Wait(2000)
            end
        end
    end
end)
