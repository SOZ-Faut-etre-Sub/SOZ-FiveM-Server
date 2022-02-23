local primaryRadioChannel = 0
local secondaryRadioChannel = 0

--- event syncRadioData
--- syncs the current players on the radio to the client
---@param radioTable table the table of the current players on the radio
---@param localPlyRadioName string the local players name
function syncRadioData(radioTable)
    radioData = radioTable
    if GetConvarInt("voice_debugMode", 0) >= 4 then
        print("-------- RADIO TABLE --------")
        tPrint(radioData)
        print("-----------------------------")
    end
    for tgt, enabled in pairs(radioTable) do
        if tgt ~= CurrentPlayer.ServerId then
            toggleVoice(tgt, enabled, "radio")
        end
    end
end
RegisterNetEvent("pma-voice:syncRadioData", syncRadioData)

--- event setTalkingOnRadio
--- sets the players talking status, triggered when a player starts/stops talking.
---@param plySource number the players server id.
---@param enabled boolean whether the player is talking or not.
function setTalkingOnRadio(plySource, enabled, isPrimary)
    toggleVoice(plySource, enabled, isPrimary and "primaryRadio" or "secondaryRadio")
    radioData[plySource] = enabled
    playMicClicks(enabled, isPrimary)
end
RegisterNetEvent("pma-voice:setTalkingOnRadio", setTalkingOnRadio)

--- event addPlayerToRadio
--- adds a player onto the radio.
---@param plySource number the players server id to add to the radio.
function addPlayerToRadio(plySource)
    radioData[plySource] = false
    if CurrentPlayer.RadioButtonPressed then
        playerTargets(radioData, MumbleIsPlayerTalking(PlayerId()) and callData or {})
    end
end
RegisterNetEvent("pma-voice:addPlayerToRadio", addPlayerToRadio)

--- event removePlayerFromRadio
--- removes the player (or self) from the radio
---@param plySource number the players server id to remove from the radio.
function removePlayerFromRadio(plySource)
    if plySource == CurrentPlayer.ServerId then
        for tgt, _ in pairs(radioData) do
            if tgt ~= CurrentPlayer.ServerId then
                toggleVoice(tgt, false, "radio")
            end
        end
        radioData = {}
        playerTargets(MumbleIsPlayerTalking(PlayerId()) and callData or {})
    else
        toggleVoice(plySource, false)
        if CurrentPlayer.RadioButtonPressed then
            playerTargets(radioData, MumbleIsPlayerTalking(PlayerId()) and callData or {})
        end
        radioData[plySource] = nil
    end
end
RegisterNetEvent("pma-voice:removePlayerFromRadio", removePlayerFromRadio)

--- function setRadioChannel
--- sets the local players current radio channel and updates the server
---@param channel number the channel to set the player to, or 0 to remove them.
function setRadioChannel(channel, isPrimary)
    type_check({channel, "number"})
    TriggerServerEvent("pma-voice:setPlayerRadio", channel, isPrimary)
    if isPrimary then
        primaryRadioChannel = channel
    else
        secondaryRadioChannel = channel
    end
end
exports("setRadioChannel", setRadioChannel)

--- exports removePlayerFromRadio
--- sets the local players current radio channel and updates the server
exports("removePlayerFromRadio", function()
    setRadioChannel(0, true)
    setRadioChannel(0, false)
end)

--- event syncRadio
--- syncs the players radio, only happens if the radio was set server side.
---@param _radioChannel number the radio channel to set the player to.
function syncRadio(_radioChannel, isPrimary)
    if isPrimary then
        primaryRadioChannel = _radioChannel
    else
        secondaryRadioChannel = _radioChannel
    end
end
RegisterNetEvent("pma-voice:clSetPlayerRadio", syncRadio)

--- Commands Core logic
local function fnRadioTalkPush(radioChannel, isPrimary)
    if IsPlayerDead(PlayerId()) then
        return
    end

    if not CurrentPlayer.RadioButtonPressed then
        if radioChannel > 0 then
            playerTargets(radioData, MumbleIsPlayerTalking(PlayerId()) and callData or {})
            TriggerServerEvent("voip:setPlayerTalking", "radio", true, isPrimary)
            CurrentPlayer.RadioButtonPressed = true
            playMicClicks(true, isPrimary)
            RequestAnimDict("random@arrests")
            while not HasAnimDictLoaded("random@arrests") do
                Citizen.Wait(10)
            end
            TaskPlayAnim(PlayerPedId(), "random@arrests", "generic_radio_enter", 8.0, 2.0, -1, 50, 2.0, 0, 0, 0)
        end
    end
end

local function fnRadioTalkRelease(radioChannel, isPrimary)
    if radioChannel > 0 and CurrentPlayer.RadioButtonPressed then
        CurrentPlayer.RadioButtonPressed = false
        MumbleClearVoiceTargetPlayers(Config.VoiceTarget)
        playerTargets(MumbleIsPlayerTalking(PlayerId()) and callData or {})
        playMicClicks(false, isPrimary)
        StopAnimTask(PlayerPedId(), "random@arrests", "generic_radio_enter", -4.0)
        TriggerServerEvent("voip:setPlayerTalking", "radio", false, isPrimary)
    end
end

--- Commands
RegisterCommand("+primaryradiotalk", function()
    fnRadioTalkPush(primaryRadioChannel, true)
end, false)
RegisterCommand("-primaryradiotalk", function()
    fnRadioTalkRelease(primaryRadioChannel, true)
end, false)
RegisterKeyMapping("+primaryradiotalk", "Parler en radio (primaire)", "keyboard", "")

RegisterCommand("+secondaryradiotalk", function()
    fnRadioTalkPush(secondaryRadioChannel, false)
end, false)
RegisterCommand("-secondaryradiotalk", function()
    fnRadioTalkRelease(secondaryRadioChannel, false)
end, false)
RegisterKeyMapping("+secondaryradiotalk", "Parler en radio (secondaire)", "keyboard", "")
