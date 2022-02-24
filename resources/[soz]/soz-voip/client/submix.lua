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

function ApplySubmixEffect(moduleType, player)
    if moduleType == "primaryRadio" then
        MumbleSetSubmixForServerId(player, radioEffectId)
    elseif moduleType == "secondaryRadio" then
        MumbleSetSubmixForServerId(player, radioEffectId)
    elseif moduleType == "phone" then
        MumbleSetSubmixForServerId(player, phoneEffectId)
    end
end

function RemoveSubmixEffect(player)
    MumbleSetSubmixForServerId(player, -1)
end
