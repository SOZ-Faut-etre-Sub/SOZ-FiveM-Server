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

local b = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"

local function base64encode(data)
    return ((data:gsub(".", function(x)
        local r, b = "", x:byte()
        for i = 8, 1, -1 do
            r = r .. (b % 2 ^ i - b % 2 ^ (i - 1) > 0 and "1" or "0")
        end
        return r;
    end) .. "0000"):gsub("%d%d%d?%d?%d?%d?", function(x)
        if (#x < 6) then
            return ""
        end
        local c = 0
        for i = 1, 6 do
            c = c + (x:sub(i, i) == "1" and 2 ^ (6 - i) or 0)
        end
        return b:sub(c + 1, c + 1)
    end) .. ({"", "==", "="})[#data % 3 + 1])
end

local function GetAuthorizationHeader(user, password)
    return "Basic " .. base64encode(user .. ":" .. password)
end

exports("SendHTTPRequest", function(convar, data)
    local url = GetConvar("soz_api_endpoint", "https://soz.zerator.com") .. GetConvar(convar, "")
    local authorization = GetAuthorizationHeader(GetConvar("soz_api_username", "admin"), GetConvar("soz_api_password", "admin"))

    if endpoint ~= "" then
        PerformHttpRequest(url, nil, "POST", json.encode(data), {
            ["Authorization"] = authorization,
            ["Content-Type"] = "application/json",
        })
    end
end)
