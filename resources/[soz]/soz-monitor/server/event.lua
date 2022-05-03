local event_handler_loki = ""
local event_buffer_loki = {}

Citizen.CreateThread(function()
    while true do
        event_handler_loki = GetConvar("log_handler_loki", "")

        Wait(10 * 1000)

        if #event_buffer_loki > 0 then
            PerformHttpRequest(event_handler_loki, function(status, text, headers)
                if status ~= 204 then
                    print("[SOZ-Monitor] Loki log handler: " .. status .. ", " .. json.encode(headers) .. ", " .. json.encode(text))
                end
            end, "POST", json.encode({streams = event_buffer_loki}), {["Content-Type"] = "application/json"})

            event_buffer_loki = {}
        end
    end
end)

local function filterAndReplace(data)
    if data.target_source then
        local Target = QBCore.Functions.GetPlayer(data.target_source)

        if Target then
            data.target_citizenid = Target.PlayerData.citizenid
            data.target_name = Target.PlayerData.charinfo.firstname .. " " .. Target.PlayerData.charinfo.lastname
            data.target_job = Target.PlayerData.job.id
            data.target_source = nil
        end
    end

    if data.player_source then
        local Player = QBCore.Functions.GetPlayer(data.player_source)

        if Player then
            data.player_citizen_id = Player.PlayerData.citizenid
            data.player_name = Player.PlayerData.charinfo.firstname .. " " .. Player.PlayerData.charinfo.lastname
            data.player_job = Player.PlayerData.job.id
            data.player_source = nil
        end
    end

    return data
end

local function formatEventLoki(name, index, content)
    local eventPayload = {}
    -- time is in nano seconds
    local timestamp = tostring(os.time()) .. "000000000"

    local messageJson = flattenTable("", content or {})

    eventPayload.values = {{timestamp, json.encode(messageJson)}}

    eventPayload.stream = index
    eventPayload.stream.emitter = GetInvokingResource() or "soz-monitor"
    eventPayload.stream.agent = "fivem"
    eventPayload.stream.type = "event"
    eventPayload.stream.event = name

    return eventPayload
end

local function handleEvent(name, index, content)
    if event_handler_loki ~= "" then
        local eventBodyLoki = formatEventLoki(name, filterAndReplace(index), filterAndReplace(content))

        table.insert(event_buffer_loki, eventBodyLoki)
    end
end

--- monitor:server:Log
--- @param name string Event name
--- @param index table Field indexed
--- @param content table Field content (not indexed)
RegisterServerEvent("monitor:server:event", function(name, index, content, addPlayerData)
    if addPlayerData then
        index.player_source = source
    end

    handleEvent(name, index, content)
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
            local vehicle = GetVehiclePedIsIn(ped, false)
            local vehicle_type
            local plate

            if vehicle ~= 0 then
                vehicle_type = GetVehicleType(vehicle)
                plate = GetVehicleNumberPlateText(vehicle)
            end

            handleEvent("player_position", {
                player_citizenid = playerData.citizenid,
                player_name = playerData.charinfo.firstname .. " " .. playerData.charinfo.lastname,
                player_job = playerData.job.id,
                vehicle_type = vehicle_type,
            }, {vehicle_plate = plate, x = playerCoords.x, y = playerCoords.y, z = playerCoords.z})
        end

        Wait(1000)
    end
end)
