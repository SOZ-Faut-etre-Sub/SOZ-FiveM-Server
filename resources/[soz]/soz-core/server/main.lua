QBCore.Commands.Add("id", "Check Your ID #", {}, false, function(source, args)
    local src = source
    TriggerClientEvent("hud:client:DrawNotification", src, "ID: " .. src)
end)

RegisterNetEvent("qb-carwash:server:washCar", function()
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)

    if Player.Functions.RemoveMoney("money", Config.DefaultPrice, "car-washed") then
        TriggerClientEvent("qb-carwash:client:washCar", src)
    else
        TriggerClientEvent("hud:client:DrawNotification", src, "Vous n'avez pas assez d'argent", "error")
    end
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
    local endpoint = GetConvar("discord_webhook_zone", nil)

    if endpoint then
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
end)
