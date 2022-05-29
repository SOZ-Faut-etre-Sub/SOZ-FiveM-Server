RegisterNetEvent("voip:client:call:start", function(callerId)
    CallModuleInstance:startCall(callerId)
end)

RegisterNetEvent("voip:client:call:end", function()
    CallModuleInstance:stopCall()
end)

RegisterNetEvent("voip:client:radio:transmission:start", function(frequency, serverID, coords, kind)
    print("Transmission start", frequency, serverID, coords, kind)

    PrimaryLongRadioModuleInstance:onTransmissionStarted(frequency, serverID, coords, kind)
    SecondaryLongRadioModuleInstance:onTransmissionStarted(frequency, serverID, coords, kind)
    PrimaryShortRadioModuleInstance:onTransmissionStarted(frequency, serverID, coords, kind)
    SecondaryShortRadioModuleInstance:onTransmissionStarted(frequency, serverID, coords, kind)
end)

RegisterNetEvent("voip:client:radio:transmission:stop", function(frequency, serverID)
    print("Transmission stop", frequency, serverID)

    PrimaryLongRadioModuleInstance:onTransmissionStopped(frequency, serverID)
    SecondaryLongRadioModuleInstance:onTransmissionStopped(frequency, serverID)
    PrimaryShortRadioModuleInstance:onTransmissionStopped(frequency, serverID)
    SecondaryShortRadioModuleInstance:onTransmissionStopped(frequency, serverID)
end)

RegisterNetEvent("voip:client:radio:connect", function(kind, instance, frequency)
    print("Radio connect", frequency, kind, instance)

    if kind == "radio-lr" and instance == "primary" then
        PrimaryLongRadioModuleInstance:connect(frequency)
    end

    if kind == "radio-lr" and instance == "secondary" then
        SecondaryLongRadioModuleInstance:connect(frequency)
    end

    if kind == "radio-sr" and instance == "primary" then
        PrimaryShortRadioModuleInstance:connect(frequency)
    end

    if kind == "radio-sr" and instance == "secondary" then
        SecondaryShortRadioModuleInstance:connect(frequency)
    end
end)

RegisterNetEvent("voip:client:radio:disconnect", function(kind, frequency, instance)
    print("Radio disconnect", frequency, kind, instance)

    if kind == "radio-lr" and instance == "primary" then
        PrimaryLongRadioModuleInstance:disconnect()
    end

    if kind == "radio-lr" and instance == "secondary" then
        SecondaryLongRadioModuleInstance:disconnect()
    end

    if kind == "radio-sr" and instance == "primary" then
        PrimaryShortRadioModuleInstance:disconnect()
    end

    if kind == "radio-sr" and instance == "secondary" then
        SecondaryShortRadioModuleInstance:disconnect()
    end
end)

RegisterCommand("+radio_lr_primary", function() PrimaryLongRadioModuleInstance:startTransmission() end, false)
RegisterCommand("-radio_lr_primary", function() PrimaryLongRadioModuleInstance:stopTransmission() end, false)
RegisterKeyMapping("+radio_lr_primary", "Parler en longue portée (primaire)", "keyboard", Config.radioLongRangePrimaryHotkey)

RegisterCommand("+radio_lr_secondary", function() SecondaryLongRadioModuleInstance:startTransmission() end, false)
RegisterCommand("-radio_lr_secondary", function() SecondaryLongRadioModuleInstance:stopTransmission() end, false)
RegisterKeyMapping("+radio_lr_secondary", "Parler en longue portée (secondaire)", "keyboard", Config.radioLongRangeSecondaryHotkey)

RegisterCommand("+radio_sr_primary", function() PrimaryShortRadioModuleInstance:startTransmission() end, false)
RegisterCommand("-radio_sr_primary", function() PrimaryShortRadioModuleInstance:stopTransmission() end, false)
RegisterKeyMapping("+radio_sr_primary", "Parler en courte portée (primaire)", "keyboard", Config.radioShortRangePrimaryHotkey)

RegisterCommand("+radio_sr_secondary", function() SecondaryShortRadioModuleInstance:startTransmission() end, false)
RegisterCommand("-radio_sr_secondary", function() SecondaryShortRadioModuleInstance:stopTransmission() end, false)
RegisterKeyMapping("+radio_sr_secondary", "Parler en courte portée (secondaire)", "keyboard", Config.radioShortRangeSecondaryHotkey)
