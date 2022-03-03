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
        SetAudioSubmixOutputVolumes(radioEffectId, 0, CurrentPlayer.Ear["primaryRadio"] <= 1 and CurrentPlayer.Volume["primaryRadio"] or 0.0,
                                    CurrentPlayer.Ear["primaryRadio"] >= 1 and CurrentPlayer.Volume["primaryRadio"] or 0.0,
                                    CurrentPlayer.Ear["primaryRadio"] <= 1 and CurrentPlayer.Volume["primaryRadio"] or 0.0,
                                    CurrentPlayer.Ear["primaryRadio"] >= 1 and CurrentPlayer.Volume["primaryRadio"] or 0.0, 1.0, 1.0)
    elseif moduleType == "secondaryRadio" then
        MumbleSetSubmixForServerId(player, radioEffectId)
        SetAudioSubmixOutputVolumes(radioEffectId, 0, CurrentPlayer.Ear["secondaryRadio"] <= 1 and CurrentPlayer.Volume["secondaryRadio"] or 0.0,
                                    CurrentPlayer.Ear["secondaryRadio"] >= 1 and CurrentPlayer.Volume["secondaryRadio"] or 0.0,
                                    CurrentPlayer.Ear["secondaryRadio"] <= 1 and CurrentPlayer.Volume["secondaryRadio"] or 0.0,
                                    CurrentPlayer.Ear["secondaryRadio"] >= 1 and CurrentPlayer.Volume["secondaryRadio"] or 0.0, 1.0, 1.0)
    elseif moduleType == "phone" then
        MumbleSetSubmixForServerId(player, phoneEffectId)
    end
end

function RemoveSubmixEffect(player)
    MumbleSetSubmixForServerId(player, -1)
end

exports("setVoiceEar", function(_type, ear)
    if CurrentPlayer.Ear[_type] then
        CurrentPlayer.Ear[_type] = ear
    end
end)
