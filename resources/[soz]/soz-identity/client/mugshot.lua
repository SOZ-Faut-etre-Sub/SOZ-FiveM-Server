function GetPedheadshot(ped)
    local step = 1000
    local timeout = 5 * 1000
    local currentTime = 0
    local pedheadshot = RegisterPedheadshot(ped)

    while not IsPedheadshotReady(pedheadshot) do
        Citizen.Wait(step)
        currentTime = currentTime + step
        if (currentTime >= timeout) then
            return -1
        end
    end

    return pedheadshot
end

exports("GetPedheadshot", GetPedheadshot)
