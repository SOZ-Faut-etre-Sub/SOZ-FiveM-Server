NativesAudiocontext = {}

function NativesAudiocontext:Connect(context, source, destination)
    return Natives.AUDIOCONTEXT_CONNECT(context, source, destination, 0, 0)
end

function NativesAudiocontext:GetForClient(client)
    return Natives.GET_AUDIOCONTEXT_FOR_CLIENT(client, Citizen.ResultAsLong(), Citizen.ReturnResultAnyway())
end

function NativesAudiocontext:GetForServerId(serverId)
    return Natives.GET_AUDIOCONTEXT_FOR_SERVERID(serverId, Citizen.ResultAsLong(), Citizen.ReturnResultAnyway())
end

function NativesAudiocontext:GetSource(context)
    return Natives.AUDIOCONTEXT_GET_SOURCE(context, Citizen.ResultAsLong(), Citizen.ReturnResultAnyway())
end

function NativesAudiocontext:GetDestination(context)
    return Natives.AUDIOCONTEXT_GET_DESTINATION(context, Citizen.ResultAsLong(), Citizen.ReturnResultAnyway())
end
