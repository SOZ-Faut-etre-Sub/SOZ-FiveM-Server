--- Private functions
local StartCall = function(serverId, callId)
    if PlayerData.IsCalling then
        return
    end

    PlayerData.IsCalling = true
    PlayerData.CurrentCall = {callId = callId, targetId = serverId}

    AddPlayerToTargetList(serverId, "call", true)
    console.debug('Call %s started with player %s', callId, serverId)
end

local StopCall = function(serverId, callId)
    if not PlayerData.IsCalling or PlayerData.CurrentCall.callId ~= callId then
        return
    end

    PlayerData.IsCalling = false
    PlayerData.CurrentCall = nil

    RemovePlayerFromTargetList(serverId, "call", true, true)
    console.debug('Call %s ended with player %s', callId, serverId)
end

function RegisterCallModule()
    console.debug("Call module registering...")

    RegisterModuleContext("call", 1)
    UpdateContextVolume("call", Config.volumes["call"])

    RegisterNetEvent("voip:client:call:start", StartCall)
    RegisterNetEvent("voip:client:call:end", StopCall)

    console.debug("Call module registered !")
end
