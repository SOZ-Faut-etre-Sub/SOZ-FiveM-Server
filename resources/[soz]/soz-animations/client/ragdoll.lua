local isInRagdoll = false
local inCooldown = false

-- Has to be executed in a Thread
CreateThread(function()
    while true do
        Wait(10)
        if isInRagdoll then
            SetPedToRagdoll(PlayerPedId(), 1000, 1000, 0, 0, 0, 0)
        end
    end
end)

RegisterKeyMapping("ragdoll", "Ragdoll", "keyboard", "z")
RegisterCommand("ragdoll", function()
    if inCooldown or IsPedInAnyVehicle(PlayerPedId(), false) then
        return
    end

    if isInRagdoll then
        isInRagdoll = false
    else
        isInRagdoll = true
        TriggerEvent("progressbar:client:cancel")
        inCooldown = true
    end

    CreateThread(function()
        Wait(1000)
        inCooldown = false
    end)
end, false)

