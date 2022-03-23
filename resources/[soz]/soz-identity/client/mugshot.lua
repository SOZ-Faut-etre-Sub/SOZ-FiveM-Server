local Headshots = {}

function GetPedheadshot(ped)
    if Headshots[ped] then
        return Headshots[ped]
    end

    local step = 50
    local timeout = 5 * 1000
    local currentTime = 0
    local pedheadshot = RegisterPedheadshot_3(ped)

    while not IsPedheadshotReady(pedheadshot) do
        Citizen.Wait(step)
        currentTime = currentTime + step
        if (currentTime >= timeout) then
            return -1
        end
    end

    if pedheadshot then
        Headshots[ped] = pedheadshot
    end

    return pedheadshot
end

exports("GetPedheadshot", GetPedheadshot)
