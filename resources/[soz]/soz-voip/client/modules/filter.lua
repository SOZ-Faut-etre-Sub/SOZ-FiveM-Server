RegisterNetEvent("voip:client:connection:state", function (serverID, isConnected)
    if not isConnected then
        DeleteFilterChain(serverID)
        console.debug("Deleted filter chain for player %s", serverID)
    end
end)
