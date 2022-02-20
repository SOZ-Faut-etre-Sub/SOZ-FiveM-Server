local callChannel = 0

---function createPhoneThread
---creates a phone thread to listen for key presses
local function createPhoneThread()
    Citizen.CreateThread(function()
        local changed = false
        while callChannel ~= 0 do
            -- check if they're pressing voice keybinds
            if MumbleIsPlayerTalking(PlayerId()) and not changed then
                changed = true
                playerTargets(CurrentPlayer.RadioButtonPressed and radioData or {}, callData)
                TriggerServerEvent("voip:setPlayerTalking", "call", true)
            elseif changed and MumbleIsPlayerTalking(PlayerId()) ~= 1 then
                changed = false
                MumbleClearVoiceTargetPlayers(Config.VoiceTarget)
                TriggerServerEvent("voip:setPlayerTalking", "call", false)
            end
            Wait(0)
        end
    end)
end

RegisterNetEvent("pma-voice:syncCallData", function(callTable, channel)
    callData = callTable
    for tgt, enabled in pairs(callTable) do
        if tgt ~= CurrentPlayer.ServerId then
            toggleVoice(tgt, enabled, "phone")
        end
    end
end)

RegisterNetEvent("pma-voice:setTalkingOnCall", function(tgt, enabled)
    if tgt ~= CurrentPlayer.ServerId then
        callData[tgt] = enabled
        toggleVoice(tgt, enabled, "phone")
    end
end)

RegisterNetEvent("pma-voice:addPlayerToCall", function(plySource)
    callData[plySource] = false
end)

RegisterNetEvent("pma-voice:removePlayerFromCall", function(plySource)
    if plySource == CurrentPlayer.ServerId then
        for tgt, _ in pairs(callData) do
            if tgt ~= CurrentPlayer.ServerId then
                toggleVoice(tgt, false, "phone")
            end
        end
        callData = {}
        MumbleClearVoiceTargetPlayers(Config.VoiceTarget)
        playerTargets(CurrentPlayer.RadioButtonPressed and radioData or {}, callData)
    else
        callData[plySource] = nil
        toggleVoice(plySource, false, "phone")
        if MumbleIsPlayerTalking(PlayerId()) then
            MumbleClearVoiceTargetPlayers(Config.VoiceTarget)
            playerTargets(CurrentPlayer.RadioButtonPressed and radioData or {}, callData)
        end
    end
end)

function setCallChannel(channel)
    TriggerServerEvent("pma-voice:setPlayerCall", channel)
    callChannel = channel
    createPhoneThread()
end

exports("setCallChannel", setCallChannel)

exports("addPlayerToCall", function(_call)
    local call = tonumber(_call)
    if call then
        setCallChannel(call)
    end
end)
exports("removePlayerFromCall", function()
    setCallChannel(0)
end)

RegisterNetEvent("pma-voice:clSetPlayerCall", function(_callChannel)
    callChannel = _callChannel
    createPhoneThread()
end)
