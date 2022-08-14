local function has_value(tab, val)
    for index, value in ipairs(tab) do
        if value == val then
            return true
        end
    end

    return false
end

RegisterNetEvent("lsmc:maladie:client:ApplyConditions", function(conditions)
    local ped = PlayerPedId()
    conditions = conditions or {}

    if has_value(conditions, Config.ConditionType.NoRun) then
        SetPlayerSprint(ped, false)
    else
        SetPlayerSprint(ped, true)
    end

    if has_value(conditions, Config.ConditionType.NoHair) then
        -- SetPlayerSprint(ped, false)
    end
end)

