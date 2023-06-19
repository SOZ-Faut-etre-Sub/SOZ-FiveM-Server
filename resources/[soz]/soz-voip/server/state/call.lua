--- @class CallStateManager
CallStateManager = {}
local CallList = {}

function CallStateManager:new()
    self.__index = self
    return setmetatable({}, self)
end

function CallStateManager:getConsumersByCallId(callId)
    return CallList[callId] or {}
end

function CallStateManager:getCallByPhoneNumber(phoneNumber)
    for callId, consumers in pairs(CallList) do
        if consumers.emitterPhone == phoneNumber or consumers.receiverPhone == phoneNumber then
            return CallList[callId]
        end
    end
    return nil
end

function CallStateManager:getCallBySourceOrTarget(sourceOrTarget)
    for callId, consumers in pairs(CallList) do
        if consumers.callerId == sourceOrTarget or consumers.receiverId == sourceOrTarget then
            return CallList[callId]
        end
    end
    return nil
end

function CallStateManager:createCall(emitter, receiver)
    local source = QBCore.Functions.GetPlayerByPhone(emitter)
    local target = QBCore.Functions.GetPlayerByPhone(receiver)
    local callId = nil

    if source == target then
        return
    end

    if source == nil or target == nil then
        return
    end

    repeat
        callId = QBCore.Shared.UuidV4()
    until not CallList[callId]

    CallList[callId] = {
        callId = callId,
        callerId = source.PlayerData.source,
        callerPhone = source.PlayerData.charinfo.phone,
        receiverId = target.PlayerData.source,
        receiverPhone = target.PlayerData.charinfo.phone,
    }

    local call = CallList[callId]
    TriggerClientEvent("voip:client:call:start", call.callerId, call.receiverId, callId)
    TriggerClientEvent("voip:client:call:start", call.receiverId, call.callerId, callId)

    exports["soz-core"]:Event("voip_call", {player_source = source.PlayerData.source, call_type = "emitter"}, call)
    exports["soz-core"]:Event("voip_call", {player_source = target.PlayerData.source, call_type = "receiver"}, call)

    return callId
end

function CallStateManager:DestroyAll()
    for callId, _ in pairs(CallList) do
        self:destroyCall(callId)
    end
end

function CallStateManager:destroyCall(callId)
    local call = CallList[callId]

    if call == nil then
        return
    end

    TriggerClientEvent("voip:client:call:end", call.callerId, call.receiverId, callId)
    TriggerClientEvent("voip:client:call:end", call.receiverId, call.callerId, callId)

    exports["soz-core"]:Event("voip_call", {player_source = call.callerId, type = "ended"}, CallList[callId])
    exports["soz-core"]:Event("voip_call", {player_source = call.receiverId, type = "ended"}, CallList[callId])

    CallList[callId] = nil
end
