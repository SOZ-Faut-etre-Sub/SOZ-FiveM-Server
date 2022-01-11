local function printLogString(level, message, playerData)
    local logMessage = ReplaceString(Config.logFormat, "%date%", FormattedDateTime())

    logMessage = ReplaceString(
                     logMessage, "%level%", (Config.logLevelColor[level] or "") .. string.format("%-5s", level)
                 )
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

    print(logMessage)
end

local function printLogJSON(level, message, playerData)
    local logPayload = {}

    logPayload.timestamp = os.time()
    logPayload.emitter = GetInvokingResource() or "soz-monitor"
    logPayload.level = level or ""
    logPayload.message = message

    if playerData then
        if type(playerData) == "table" then
            if playerData.charinfo ~= nil then
                logPayload.player = playerDataModel(playerData)
            else
                logPayload.player = playerData
            end
        else
            logPayload.source = playerData
        end
    end

    print(json.encode(logPayload))
end

--- printFormattedLog
--- @param level string
--- @param message string
--- @param playerData PlayerData
local function printFormattedLog(level, message, playerData)
    if not Config.logLevelIndex[level:upper()] then
        return
    end
    if Config.logLevelIndex[level:upper()] < Config.logLevelIndex[GetConvar("log_level", "info"):upper()] then
        return
    end

    if PlayerData then
        if type(playerData) == "number" then
            local Player = QBCore.Functions.GetPlayer(PlayerData)

            if Player then
                playerData = Player
            end
        end
    end

    if GetConvar("log_format", "text") == "text" then
        printLogString(level, message, playerData)
    elseif GetConvar("log_format", "text") == "json" then
        printLogJSON(level, message, playerData)
    else
        printLogString("FATAL", "Your log_format is not valid. Valid format is json or text.")
    end
end

--- monitor:server:Log
--- @param level string Log level
--- @param message string Message
RegisterServerEvent(
    "monitor:server:Log", function(level, message)
        printFormattedLog(level, message, source)
    end
)

exports("Log", printFormattedLog)
