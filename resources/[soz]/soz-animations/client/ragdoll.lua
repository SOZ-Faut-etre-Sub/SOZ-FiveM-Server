local isInRagdoll = false

CreateThread(function()
    while true do
        Wait(10)
        if isInRagdoll then
            SetPedToRagdoll(PlayerPedId(), 1000, 1000, 0, 0, 0, 0)
        end
    end
end)

local inputRagdoll = false
local inCooldown = false

RegisterKeyMapping("ragdoll", "Ragdoll", "keyboard", "w")
RegisterCommand("ragdoll", function()
    if inCooldown then
        return
    end
    inputRagdoll = not inputRagdoll
    inCooldown = true
end, false)

CreateThread(function()
    while true do
        Wait(0)
        if IsControlJustPressed(2, 20) and IsPedOnFoot(PlayerPedId()) then
            if isInRagdoll then
                isInRagdoll = false
            else
                isInRagdoll = true
                TriggerEvent("progressbar:client:cancel")
                Wait(500)
            end
        end
    end
end)

