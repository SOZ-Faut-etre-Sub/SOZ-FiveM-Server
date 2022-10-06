local criticalHealth = 40
local criticalHealthNotification = false

CreateThread(function()
    while true do
        local playerPed = PlayerPedId()
        if GetEntityHealth(playerPed) <= criticalHealth then
            RequestAnimSet("move_injured_generic")
            SetPedMovementClipset(playerPed, "move_injured_generic", true)

            if IsPedInMeleeCombat(playerPed) then
                SetPedToRagdoll(playerPed, 1000, 1000, 0, 0, 0, 0)
            end

            DisableControlAction(0, 21, true) -- disable sprint
            DisableControlAction(0, 22, true) -- Jump

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
