--- Commands Core logic
local function fnRadioTalkPush(module, isPrimary)
    if IsPlayerDead(PlayerId()) then
        return
    end

    if CurrentPlayer.RadioButtonPressed or CurrentPlayer.LastRadioButtonPressed + 200 > GetGameTimer() then
        return
    end

    local radioChannel = LocalPlayer.state[module][isPrimary and "primaryChannel" or "secondaryChannel"]
    CurrentPlayer.LastRadioButtonPressed = GetGameTimer()

    if radioChannel > 0 then
        playerTargets(voiceModule[module]:getConsumers(), MumbleIsPlayerTalking(PlayerId()) and voiceModule["call"]:getConsumers() or {})
        TriggerServerEvent("voip:server:setPlayerTalking", module, true, isPrimary)
        CurrentPlayer.RadioButtonPressed = true
        playMicClicks(module, true, isPrimary)
        RequestAnimDict("random@arrests")
        while not HasAnimDictLoaded("random@arrests") do
            Citizen.Wait(10)
        end
        TaskPlayAnim(PlayerPedId(), "random@arrests", "generic_radio_enter", 8.0, 2.0, -1, 50, 2.0, 0, 0, 0)
    end
end

local function fnRadioTalkRelease(module, isPrimary)
    local radioChannel = LocalPlayer.state[module][isPrimary and "primaryChannel" or "secondaryChannel"]
    if radioChannel > 0 and CurrentPlayer.RadioButtonPressed then
        CurrentPlayer.RadioButtonPressed = false
        MumbleClearVoiceTargetPlayers(Config.VoiceTarget)
        playerTargets(MumbleIsPlayerTalking(PlayerId()) and voiceModule["call"]:getConsumers() or {})
        playMicClicks(module, false, isPrimary)
        StopAnimTask(PlayerPedId(), "random@arrests", "generic_radio_enter", -4.0)
        TriggerServerEvent("voip:server:setPlayerTalking", module, false, isPrimary)
    end
end

--- Commands
--- Short Range
RegisterCommand("+radio_sr_primary", function()
    fnRadioTalkPush("radio-sr", true)
end, false)
RegisterCommand("-radio_sr_primary", function()
    fnRadioTalkRelease("radio-sr", true)
end, false)
RegisterKeyMapping("+radio_sr_primary", "Parler en courte portée (primaire)", "keyboard", "COMMA")

RegisterCommand("+radio_sr_secondary", function()
    fnRadioTalkPush("radio-sr", false)
end, false)
RegisterCommand("-radio_sr_secondary", function()
    fnRadioTalkRelease("radio-sr", false)
end, false)
RegisterKeyMapping("+radio_sr_secondary", "Parler en courte portée (secondaire)", "keyboard", "SEMICOLON")

--- Long Range
RegisterCommand("+radio_lr_primary", function()
    fnRadioTalkPush("radio-lr", true)
end, false)
RegisterCommand("-radio_lr_primary", function()
    fnRadioTalkRelease("radio-lr", true)
end, false)
RegisterKeyMapping("+radio_lr_primary", "Parler en longue portée (primaire)", "keyboard", "")

RegisterCommand("+radio_lr_secondary", function()
    fnRadioTalkPush("radio-lr", false)
end, false)
RegisterCommand("-radio_lr_secondary", function()
    fnRadioTalkRelease("radio-lr", false)
end, false)
RegisterKeyMapping("+radio_lr_secondary", "Parler en longue portée (secondaire)", "keyboard", "")
