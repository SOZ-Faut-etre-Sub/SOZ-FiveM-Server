local isInRagdoll = false
local inCooldown = false

-- Has to be executed in a Thread
local function ragdollLoop()
    while true do
        Wait(10)
        if isInRagdoll then
            SetPedToRagdoll(PlayerPedId(), 1000, 1000, 0, 0, 0, 0)
        end
    end
end

-- Has to be executed in a thread
local function cooldown()
    Wait(1000)
    inCooldown = false
end

RegisterKeyMapping("ragdoll", "Ragdoll", "keyboard", "z")
RegisterCommand("ragdoll", function()
    if inCooldown then
        return
    end
    if isInRagdoll then
        isInRagdoll = false
    else
        isInRagdoll = true
        TriggerEvent("progressbar:client:cancel")
        CreateThread(ragdollLoop)
        inCooldown = true
    end
    CreateThread(cooldown)
end, false)

