QBCore = exports["qb-core"]:GetCoreObject()

RegisterNetEvent("voip:server:connection:state", function(state)
    TriggerClientEvent("voip:client:connection:state", -1, source, state)
end)
