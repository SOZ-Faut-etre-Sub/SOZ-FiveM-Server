--- Add timeout function in promises
function promise:timeout(time)
    local p = promise:new()

    Citizen.SetTimeout(time, function()
        p:resolve(true)
    end)

    return p
end
