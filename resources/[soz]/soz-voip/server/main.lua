voiceModule = {}

voiceData = {}
radioData = {}
callData = {}

--- Function
function defaultVoiceDataTable()
    return {call = 0, primaryRadio = 0, secondaryRadio = 0}
end

local function setupPlayerStateBag(source)
    local player = Player(source).state
    if not player.voipInit then
        player:set("proximity", {}, true)
        player:set("voiceIntent", "speech", true)
        player:set("useLongRangeRadio", false, true)

        player:set("phone", Config.DefaultVolume["phone"], true)
        player:set("primaryRadio", Config.DefaultVolume["primaryRadio"], true)
        player:set("secondaryRadio", Config.DefaultVolume["secondaryRadio"], true)

        player:set("callChannel", 0, true)
        player:set("primaryRadioChannel", 0, true)
        player:set("secondaryRadioChannel", 0, true)

        player:set("voipInit", true, false)
    end
end

local function handleNewPlayer(source)
    if not voiceData[source] then
        setupPlayerStateBag(source)
        voiceData[source] = defaultVoiceDataTable()
    end
end

--- Events
AddEventHandler("playerJoining", function()
    handleNewPlayer(source)
end)

AddEventHandler("playerDropped", function()
    if voiceData[source] then
        local player = voiceData[source]

        for module, _ in pairs(voiceModule) do
            if player[module] ~= 0 then
                voiceModule[module]:removePlayer(source, player[module], true)
                if module == "radio" then --- Drop primary and secondary channel for radio
                    voiceModule[module]:removePlayer(source, player[module], false)
                end
            end
        end

        voiceData[source] = nil
    end
end)

RegisterNetEvent("voip:setPlayerTalking", function(module, talking, extra)
    voiceModule[module]:setTalking(source, talking, extra)
end)

--- Exports
exports("isValidPlayer", function(source)
    return voiceData[source]
end)
