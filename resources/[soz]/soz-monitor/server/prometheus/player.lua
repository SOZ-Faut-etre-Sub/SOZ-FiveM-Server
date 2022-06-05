local playerList = {}
local playerListConnected = {}

local function BuildListFromDatabase()
    local newPlayerList = {}
    local players = MySQL.query.await("SELECT * FROM player WHERE is_default = 1", {})

    for _, player in pairs(players) do
        local playerData = player

        playerData.money = json.decode(player.money)
        playerData.job = json.decode(player.job)
        playerData.position = json.decode(player.position)
        playerData.metadata = json.decode(player.metadata)
        playerData.charinfo = json.decode(player.charinfo)
        playerData.skin = json.decode(player.skin)
        playerData.cloth_config = json.decode(player.cloth_config)

        if playerData.gang then
            playerData.gang = json.decode(playerData.gang)
        else
            playerData.gang = {}
        end

        playerData.connection_status = "not_connected"
        newPlayerList[playerData.license] = playerData
    end

    playerList = newPlayerList
end

local function OverrideConnected()
    local players = QBCore.Functions.GetQBPlayers()
    playerListConnected = {}

    for _, player in pairs(players) do
        local playerData = player.PlayerData

        playerListConnected[playerData.license] = playerData
        playerListConnected[playerData.license].connection_status = "connected"
    end
end

Citizen.CreateThread(function()
    while true do
        BuildListFromDatabase()

        Citizen.Wait(60 * 1000)
    end
end)

Citizen.CreateThread(function()
    while true do
        OverrideConnected()

        Citizen.Wait(4 * 1000)
    end
end)

local function CreateMetrics(name, type, description, labels, getValue)
    local metricsString = ([[

# HELP %s %s
# TYPE %s %s
]]):format(name, description, name, type)

    for id, player in pairs(playerList) do
        if playerListConnected[id] then
            player = playerListConnected[id]
        end

        metricsString = metricsString .. string.format([[
%s{%s} %s
]], name, labels[id], getValue(player))
    end

    return metricsString
end

-- Get all metrics about player
function GetPlayerMetrics()
    local metricsString = ""
    local labels = {}

    for id, player in pairs(playerList) do
        if playerListConnected[id] then
            player = playerListConnected[id]
        end

        labels[id] = string.format("id=\"%s\",name=\"%s %s\",license=\"%s\",job=\"%s\",grade=\"%s\",status=\"%s\"", player.citizenid, player.charinfo.firstname,
                                   player.charinfo.lastname, player.license, player.job.id, player.job.grade or 0, player.connection_status)
    end

    metricsString = metricsString .. CreateMetrics("soz_player_connected", "gauge", "Is player connected", labels, function(player)
        if player.connection_status == "connected" then
            return 1
        end

        return 0
    end)

    metricsString = metricsString .. CreateMetrics("soz_player_health", "gauge", "Health of a player", labels, function(player)
        return player.metadata.health or 200
    end)

    metricsString = metricsString .. CreateMetrics("soz_player_armor", "gauge", "Armor of a player", labels, function(player)
        return player.metadata.armor.current
    end)

    metricsString = metricsString .. CreateMetrics("soz_player_hunger", "gauge", "Hunger of a player", labels, function(player)
        return player.metadata.hunger
    end)

    metricsString = metricsString .. CreateMetrics("soz_player_thirst", "gauge", "Thirst of a player", labels, function(player)
        return player.metadata.thirst
    end)

    metricsString = metricsString .. CreateMetrics("soz_player_onduty", "gauge", "Is player on duty", labels, function(player)
        if player.connection_status == "connected" and player.job.onduty then
            return 1
        end

        return 0
    end)

    return metricsString
end

