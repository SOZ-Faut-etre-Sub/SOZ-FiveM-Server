local event_handler_loki = ""
local event_buffer_loki = {}

Citizen.CreateThread(function()
    while true do
        event_handler_loki = GetConvar("log_handler_loki", "")

        Wait(10000)

        if #event_buffer_loki > 0 then
            PerformHttpRequest(event_handler_loki, function(status, text, headers)
                if status ~= 204 then
                    print("[SOZ-Monitor] Loki log handler: " .. status .. ", " .. json.encode(headers) .. ", " .. json.encode(text))
                end

                print("[SOZ-Monitor] Loki log handler: " .. status .. ", " .. json.encode(headers) .. ", " .. json.encode(text))
            end, "POST", json.encode({streams = event_buffer_loki}), {["Content-Type"] = "application/json"})

            event_buffer_loki = {}
        end
    end
end)

local function AddEventPlayerData(data, playerData)
    data.player_source = playerData.source
    data.player_citizenid = playerData.citizenid
    data.player_license = playerData.license
    data.player_name = playerData.charinfo.firstname .. " " .. playerData.charinfo.lastname

    return data
end

local function formatEventLoki(name, index, content, playerData)
    local eventPayload = {}
    -- time is in nano seconds
    local timestamp = tostring(os.time()) .. "000000000"

    if playerData then
        content = AddEventPlayerData(content, playerData)
    end

    local messageJson = flattenTable("", content or {})

    eventPayload.values = {{timestamp, json.encode(messageJson)}}

    eventPayload.stream = index
    eventPayload.stream.emitter = GetInvokingResource() or "soz-monitor"
    eventPayload.stream.agent = "fivem"
    eventPayload.stream.type = "event"
    eventPayload.stream.event = name

    if playerData then
        eventPayload.stream.steam = playerData.license or nil
    end

    return eventPayload
end

local function handleEvent(name, index, content, playerData)
    if event_handler_loki ~= "" then
        local eventBodyLoki = formatEventLoki(name, index, content, playerData)

        table.insert(event_buffer_loki, eventBodyLoki)
    end
end

--- monitor:server:Log
--- @param name string Event name
--- @param index table Field indexed
--- @param content table Field content (not indexed)
RegisterServerEvent("monitor:server:Event", function(name, index, content, addPlayerData)
    local playerData

    if addPlayerData then
        local Player = QBCore.Functions.GetPlayer(source)

        if Player then
            playerData = Player.PlayerData
        end
    end

    handleEvent(name, index, content, playerData)
end)

exports("Event", handleEvent)

-- Event player position
Citizen.CreateThread(function()
    while true do
        local players = QBCore.Functions.GetQBPlayers()

        for src, player in pairs(players) do
            local playerData = player.PlayerData
            local ped = GetPlayerPed(src)
            local playerCoords = GetEntityCoords(ped)

            handleEvent("player_position", {
                player_citizenid = playerData.citizenid,
                player_name = playerData.charinfo.firstname .. " " .. playerData.charinfo.lastname
            }, {
                x = playerCoords.x,
                y = playerCoords.y,
                z = playerCoords.z,
            })
        end

        Wait(1000)
    end
end)
