local log_format = "text"
local log_level = "INFO"
local log_handler_stdout = "true"
local log_handler_loki = ""
local log_buffer_loki = {}

Citizen.CreateThread(function()
    while true do
        log_format = GetConvar("log_format", "text")
        log_level = GetConvar("log_level", "INFO"):upper()
        log_handler_stdout = GetConvar("log_handler_stdout", "true")
        log_handler_loki = GetConvar("log_handler_loki", "")

        Wait(60 * 1000)

        if #log_buffer_loki > 0 then
            PerformHttpRequest(log_handler_loki, function(status, text, headers)
                if status ~= 204 then
                    print("[SOZ-Monitor] Loki log handler: " .. status .. ", " .. json.encode(headers) .. ", " .. json.encode(text))
                end
            end, "POST", json.encode({streams = log_buffer_loki}), {["Content-Type"] = "application/json"})

            log_buffer_loki = {}
        end
    end
end)

local function formatLogString(level, message, playerData)
    local logMessage = ReplaceString(Config.logFormat, "%date%", FormattedDateTime())

    logMessage = ReplaceString(logMessage, "%level%", (Config.logLevelColor[level] or "") .. string.format("%-5s", level))
    logMessage = ReplaceString(logMessage, "%emitter%", GetInvokingResource() or "soz-monitor")
    logMessage = ReplaceString(logMessage, "%msg%", message or "")

    if playerData then
        if type(playerData) == "table" then
            if playerData.charinfo ~= nil then
                logMessage = logMessage .. " | player: " .. json.encode(playerDataModel(playerData))
            else
                logMessage = logMessage .. " | player: " .. json.encode(playerData)
            end
        else
            logMessage = logMessage .. " | source: " .. playerData
        end
    end

    return logMessage
end

local function formatLogJson(level, message, extraData)
    local logPayload = {}

    logPayload.timestamp = os.time()
    logPayload.emitter = GetInvokingResource() or "soz-monitor"
    logPayload.level = level or ""
    logPayload.message = message
    logPayload.extra = extraData

    return json.encode(logPayload)
end

local function flattenTable(prefix, data)
    if not data then
        return {}
    end

    if type(data) ~= "table" then
        return {prefix = data}
    end

    local values = {}

    for k, v in pairs(data) do
        local prefixName = k

        if prefix ~= "" then
            prefixName = prefix .. "." .. tostring(k)
        end

        if type(v) == "table" then
            for name, value in pairs(flattenTable(prefixName, v)) do
                values[name] = value
            end
        else
            values[prefixName] = v
        end
    end

    return values
end

local function formatLogLoki(level, message, extraData)
    local logPayload = {}
    -- time is in nano seconds
    local timestamp = tostring(os.time()) .. "000000000"
    local messageJson = flattenTable("", extraData or {})
    messageJson.message = message

    logPayload.values = {{timestamp, json.encode(messageJson)}}

    logPayload.stream = {}
    logPayload.stream.level = level:upper()
    logPayload.stream.emitter = GetInvokingResource() or "soz-monitor"
    logPayload.stream.agent = "fivem"

    if extraData.player then
        logPayload.stream.steam = extraData.player.license or nil
        logPayload.stream.steam = extraData.player.license
    end

    if extraData.type then
        logPayload.stream.type = extraData.type
    else
        if extraData.event then
            logPayload.stream.type = "event"
            logPayload.stream.event = extraData.event
        elseif extraData.callback then
            logPayload.stream.type = "callback"
            logPayload.stream.callback = extraData.callback
        else
            logPayload.stream.type = "log"
        end
    end

    return logPayload
end

local function handleLog(level, message, extraData)
    if Config.logLevelIndex[level:upper()] < Config.logLevelIndex[log_level] then
        return
    end

    if log_handler_stdout == "true" then
        local logString

        if log_format == "json" then
            logString = formatLogJson(level, message, extraData)
        else
            logString = formatLogString(level, message, extraData)
        end

        print(logString)
    end

    if log_handler_loki ~= "" then
        local logBodyLoki = formatLogLoki(level, message, extraData)

        table.insert(log_buffer_loki, logBodyLoki)
    end
end

--- monitor:server:Log
--- @param level string Log level
--- @param message string Message
RegisterServerEvent("monitor:server:Log", function(level, message, extraData)
    local data = extraData or {}
    local Player = QBCore.Functions.GetPlayer(source)

    if Player then
        data.player = data.player or playerDataModel(Player.PlayerData)
    end

    handleLog(level, message, data)
end)

exports("Log", handleLog)
