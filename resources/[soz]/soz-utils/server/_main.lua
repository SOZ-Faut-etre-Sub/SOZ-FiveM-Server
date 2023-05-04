QBCore = exports["qb-core"]:GetCoreObject()

QBCore.Commands.Add("id", "Check Your ID #", {}, false, function(source, args)
    local src = source
    TriggerClientEvent("soz-core:client:notification:draw", src, "ID: " .. src)
end)

QBCore.Functions.CreateCallback("smallresources:server:GetCurrentPlayers", function(source, cb)
    local TotalPlayers = {0, GetConvarInt("sv_maxclients", 256)}
    for k, v in pairs(QBCore.Functions.GetPlayers()) do
        TotalPlayers[1] = TotalPlayers[1] + 1
    end
    cb(TotalPlayers)
end)

AddEventHandler("chatMessage", function(playerId, playerName, message)
    if string.sub(message, 1, string.len("/")) ~= "/" then
        CancelEvent()
    end
end)

--- Admin
RegisterNetEvent("core:server:zoneIntrusion", function(zone)
    local Player = QBCore.Functions.GetPlayer(source)
    local endpoint = GetConvar("discord_webhook_zone", "")

    if endpoint ~= "" then
        PerformHttpRequest(endpoint, nil, "POST", json.encode({
            username = "SOZ reporter",
            embeds = {
                ["title"] = "**Intrusion dans une zone interdite**",
                ["color"] = 16586776,
                ["fields"] = {
                    {["name"] = "Joueur", ["value"] = Player.Functions.GetName(), ["inline"] = true},
                    {["name"] = "Zone", ["value"] = zone, ["inline"] = true},
                },
            },
        }), {["Content-Type"] = "application/json"})
    else
        print(("[SOZ REPORTER] Intrusion de %s dans la zone: %s"):format(Player.Functions.GetName(), zone))
    end

    TriggerEvent("monitor:server:event", "zone_intrusion", {player_source = Player.PlayerData.source, zone = zone},
                 {position = GetEntityCoords(GetPlayerPed(Player.PlayerData.source))})
end)

exports("SendHTTPRequest", function(convar, data)
    local endpoint = GetConvar(convar, "")

    if endpoint ~= "" then
        PerformHttpRequest(endpoint, nil, "POST", json.encode(data), {["Content-Type"] = "application/json"})
    end
end)
