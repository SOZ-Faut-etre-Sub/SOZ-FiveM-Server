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

RegisterNetEvent("voip:server:transmission:state", function(group, context, transmitting, isMult)
    if isMult then
        for _, v in pairs(group) do
            TriggerClientEvent('voip:client:voice:transmission:state', v, source, context, transmitting)
        end
    else
        TriggerClientEvent('voip:client:voice:transmission:state', group, source, context, transmitting)
    end
end)

AddEventHandler('playerDropped', function()
    TriggerEvent("voip:server:call:end", source)
end)
