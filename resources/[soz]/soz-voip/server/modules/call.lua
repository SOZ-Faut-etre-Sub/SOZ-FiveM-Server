local CallState = CallStateManager:new()

RegisterNetEvent("voip:server:call:start", function(caller, receiver)
    local call = CallState:getCallByPhoneNumber(receiver)

    if call == nil then
        CallState:createCall(caller, receiver)
    end
end)

RegisterNetEvent("voip:server:call:end", function(target)
    local player = QBCore.Functions.GetPlayer(target or source)
    local call = CallState:getCallByPhoneNumber(player.PlayerData.charinfo.phone)

    if call then
        CallState:destroyCall(call.callId)
    end
end)

AddEventHandler("playerDropped", function()
    TriggerEvent("voip:server:call:end", source)
end)
