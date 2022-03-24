local spike_prop = GetHashKey("p_ld_stinger_s")
local Spikes = {}

--- Usable Items
RegisterNetEvent("police:server:placeSpike", function(item)
    local Player = QBCore.Functions.GetPlayer(source)

    for _, allowedJob in ipairs(Config.AllowedJobInteraction) do
        if Player.PlayerData.job.id == allowedJob then
            if exports["soz-inventory"]:GetItem(Player.PlayerData.source, item, nil, true) >= 1 then
                exports["soz-inventory"]:RemoveItem(Player.PlayerData.source, item, 1)
                TriggerClientEvent("police:client:RequestAddSpike", Player.PlayerData.source)
            end

            return
        end
    end
end)

--- Events
RegisterNetEvent("police:server:AddSpike", function(position)
    local spike = CreateObjectNoOffset(spike_prop, position.x, position.y, position.z, true, true, false)
    SetEntityHeading(spike, position.w)
    FreezeEntityPosition(spike, true)

    Spikes[NetworkGetNetworkIdFromEntity(spike)] = position

    TriggerClientEvent("police:client:SyncSpikes", -1, Spikes)
end)

RegisterNetEvent("police:server:RemoveSpike", function(objNet)
    if Spikes[objNet] then
        DeleteEntity(NetworkGetEntityFromNetworkId(objNet))
        Spikes[objNet] = nil

        TriggerClientEvent("police:client:SyncSpikes", -1, Spikes)
    end
end)
