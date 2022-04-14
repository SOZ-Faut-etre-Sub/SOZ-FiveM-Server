local criticalHealth = 150
local criticalHealthNotification = false
local unarmedHash = GetHashKey("WEAPON_UNARMED")

CreateThread(function()
    while true do
        local playerPed = PlayerPedId()
        if GetEntityHealth(playerPed) <= criticalHealth then
            RequestAnimSet("move_injured_generic")
            SetPedMovementClipset(playerPed, "move_injured_generic", true)

            if IsPedInMeleeCombat(playerPed) then
                SetPedToRagdoll(playerPed, 1000, 1000, 0, 0, 0, 0)
            end

            if GetSelectedPedWeapon(playerPed) ~= unarmedHash then
                SetCurrentPedWeapon(playerPed, unarmedHash, true)
            end

            DisableControlAction(0, 24, true) -- Attack
            DisableControlAction(0, 257, true) -- Attack 2
            DisableControlAction(0, 25, true) -- Aim
            DisableControlAction(0, 263, true) -- Melee Attack 1
            DisableControlAction(0, 45, true) -- Reload
            DisableControlAction(0, 21, true) -- disable sprint
            DisableControlAction(0, 22, true) -- Jump
            DisableControlAction(0, 44, true) -- Cover
            DisableControlAction(0, 37, true) -- Select Weapon
            DisableControlAction(2, 36, true) -- Disable going stealth
            DisableControlAction(0, 47, true) -- Disable weapon
            DisableControlAction(0, 264, true) -- Disable melee
            DisableControlAction(0, 257, true) -- Disable melee
            DisableControlAction(0, 140, true) -- Disable melee
            DisableControlAction(0, 141, true) -- Disable melee
            DisableControlAction(0, 142, true) -- Disable melee
            DisableControlAction(0, 143, true) -- Disable melee

            if not criticalHealthNotification then
                TriggerEvent("hud:client:DrawNotification", "Vous avez ~r~besoin~s~ de soins !", "info")

                criticalHealthNotification = true
            end
        else
            criticalHealthNotification = false
        end

        Wait(0)
    end
end)
