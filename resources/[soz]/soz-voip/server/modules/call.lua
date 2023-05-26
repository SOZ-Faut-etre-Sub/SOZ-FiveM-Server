local CallState = CallStateManager:new()

exports("StopAllPhoneCall", function()
    CallState:DestroyAll()
end)

RegisterNetEvent("voip:server:call:start", function(caller, receiver)
    local globalState = exports["soz-core"]:GetGlobalState()

    if globalState.blackoutLevel > 2 then
        return
    end

    local call = CallState:getCallByPhoneNumber(receiver)

    if call == nil then
        CallState:createCall(caller, receiver)
    end
end)

RegisterNetEvent("voip:server:call:end", function(target)
    local call = CallState:getCallBySourceOrTarget(target or source)

    if call then
        CallState:destroyCall(call.callId)
    end
end)

AddEventHandler("playerDropped", function()
    TriggerEvent("voip:server:call:end", source)
end)
