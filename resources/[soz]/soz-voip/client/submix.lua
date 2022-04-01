local radioEffectId = CreateAudioSubmix("Radio")
SetAudioSubmixEffectRadioFx(radioEffectId, 0)
SetAudioSubmixEffectParamInt(radioEffectId, 0, GetHashKey("default"), 1)
AddAudioSubmixOutput(radioEffectId, 0)

local phoneEffectId = CreateAudioSubmix("Phone")
SetAudioSubmixEffectRadioFx(phoneEffectId, 1)
SetAudioSubmixEffectParamInt(phoneEffectId, 1, GetHashKey("default"), 1)
SetAudioSubmixEffectParamFloat(phoneEffectId, 1, GetHashKey("freq_low"), 300.0)
SetAudioSubmixEffectParamFloat(phoneEffectId, 1, GetHashKey("freq_hi"), 6000.0)
AddAudioSubmixOutput(phoneEffectId, 1)

function ApplySubmixEffect(module, player, extra)
    if module == "radio-sr" or module == "radio-lr" then
        MumbleSetSubmixForServerId(player, radioEffectId)

        if extra == "primary" or extra == "secondary" then
            local earState = LocalPlayer.state[module][extra .. "ChannelEar"]
            local volumeState = LocalPlayer.state[module][extra .. "ChannelVolume"] / 100

            SetAudioSubmixOutputVolumes(radioEffectId, 0, earState <= 1 and volumeState or 0.0, earState >= 1 and volumeState or 0.0,
                                        earState <= 1 and volumeState or 0.0, earState >= 1 and volumeState or 0.0, 1.0, 1.0)
        end
    elseif module == "call" then
        MumbleSetSubmixForServerId(player, phoneEffectId)
    elseif module == "megaphone" then
        MumbleSetSubmixForServerId(player, radioEffectId)
    end
end

function RemoveSubmixEffect(player)
    MumbleSetSubmixForServerId(player, -1)
end
