---A synchronous implementation of progressbar
---@return boolean - Did progressbar went all the way through?
---@return number - Percentage of completion
exports("Progressbar", function(name, label, duration, useWhileDead, canCancel, disableControls, animation, prop, propTwo)
    local duration = exports["soz-upw"]:CalculateDuration(duration)
    local start = GetGameTimer()

    local p = promise.new()

    exports["progressbar"]:Progress({
        name = name:lower(),
        duration = duration,
        label = label,
        useWhileDead = useWhileDead,
        canCancel = canCancel,
        controlDisables = disableControls,
        animation = animation,
        prop = prop,
        propTwo = propTwo,
    }, function(wasCancelled)
        if wasCancelled then
            local elapsedBeforeCancel = math.floor(GetGameTimer() - start) / duration
            p:resolve(elapsedBeforeCancel)
        else
            p:resolve(1)
        end
    end)

    local elapsed = Citizen.Await(p)

    if elapsed >= 1 then
        return true, elapsed
    else
        return false, elapsed
    end
end)
