--- Functions
local function IsInRangeOfRadio(context, source, target)
    if context ~= "radio-sr" then
        return true
    end

    return #(source - GetEntityCoords(GetPlayerPed(target))) <= Config.radioShortRangeDistance
end

RegisterNetEvent("voip:server:player:mute", function(mute, target)
    MumbleSetPlayerMuted(target or source, mute)
end)

RegisterNetEvent("voip:server:transmission:state", function(group, context, transmitting, isMult)
    local coord = GetEntityCoords(GetPlayerPed(source))

    if isMult then
        for player, _ in pairs(group) do
            TriggerClientEvent('voip:client:voice:transmission:state', player, source, context, transmitting, IsInRangeOfRadio(context, coord, player))
        end
    else
        TriggerClientEvent('voip:client:voice:transmission:state', group, source, context, transmitting, IsInRangeOfRadio(context, coord, group))
    end
end)

QBCore.Functions.CreateCallback("voip:server:player:isMuted", function(source, cb, target)
    cb(MumbleIsPlayerMuted(target or source))
end)
