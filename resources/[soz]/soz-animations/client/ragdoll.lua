local isInRagdoll = false

CreateThread(function()
    while true do
        Wait(10)
        if isInRagdoll then
            SetPedToRagdoll(PlayerPedId(), 1000, 1000, 0, 0, 0, 0)
        end
    end
end)

CreateThread(function()
    while true do
        Wait(0)
        if IsControlJustPressed(2, 303) and IsPedOnFoot(PlayerPedId()) then
            if isInRagdoll then
                isInRagdoll = false
            else
                isInRagdoll = true
                Wait(500)
            end
        end
    end
end)

